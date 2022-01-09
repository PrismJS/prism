'use strict';


/**
 * @typedef TokenStreamItem
 * @property {string} type
 * @property {string | Array<string|TokenStreamItem>} content
 *
 * @typedef {Array<string|TokenStreamItem>} TokenStream
 *
 * @typedef {Array<string | [string, string | Array]>} SimplifiedTokenStream
 *
 * @typedef {Array<PrettyTokenStreamItem>} PrettyTokenStream
 * @typedef {string | LineBreakItem | GlueItem | [string, string | Array]} PrettyTokenStreamItem
 */

module.exports = {

	/**
	 * Simplifies the token stream to ease the matching with the expected token stream.
	 *
	 * * Strings are kept as-is
	 * * In arrays each value is transformed individually
	 * * Values that are empty (empty arrays or strings only containing whitespace)
	 *
	 * @param {TokenStream} tokenStream
	 * @returns {SimplifiedTokenStream}
	 */
	simplify: function simplify(tokenStream) {
		return tokenStream
			.map(innerSimple)
			.filter(value => !(typeof value === 'string' && isBlank(value)));

		/**
		 * @param {string | TokenStreamItem} value
		 * @returns {string | [string, string | Array]}
		 */
		function innerSimple(value) {
			if (typeof value === 'object') {
				if (Array.isArray(value.content)) {
					return [value.type, simplify(value.content)];
				} else {
					return [value.type, value.content];
				}
			} else {
				return value;
			}
		}
	},

	/**
	 * @param {TokenStream} tokenStream
	 * @param {string} [indentation]
	 * @returns {string}
	 */
	prettyprint(tokenStream, indentation) {
		return printPrettyTokenStream(toPrettyTokenStream(tokenStream), undefined, indentation);
	}
};

/**
 * This item indicates that one or multiple line breaks are present between the preceding and following items in the
 * source token stream.
 *
 * Only if an item is enabled will it appear in the pretty-printed token stream.
 */
class LineBreakItem {
	/** @param {number} sourceCount */
	constructor(sourceCount) {
		this.sourceCount = sourceCount;
		this.enabled = false;
	}
}
/**
 * This item indicates the the preceding and following items are to be printed on the same line in the pretty-printed
 * token stream.
 */
class GlueItem { }

/**
 * @param {TokenStream} tokenStream
 * @param {number} [level]
 * @returns {PrettyTokenStream}
 */
function toPrettyTokenStream(tokenStream, level = 0) {
	/** @type {PrettyTokenStream} */
	const prettyStream = [];
	for (const token of tokenStream) {
		if (typeof token === 'string') {
			if (isBlank(token)) {
				// blank string
				const lineBreaks = countLineBreaks(token);
				if (lineBreaks > 0) {
					prettyStream.push(new LineBreakItem(lineBreaks));
				}
			} else {
				// might start with line breaks
				const startLineBreaks = countLineBreaks(/^\s*/.exec(token)[0]);
				if (startLineBreaks > 0) {
					prettyStream.push(new LineBreakItem(startLineBreaks));
				}

				prettyStream.push(token);

				const endLineBreaks = countLineBreaks(/\s*$/.exec(token)[0]);
				if (endLineBreaks > 0) {
					prettyStream.push(new LineBreakItem(endLineBreaks));
				}
			}
		} else {
			prettyStream.push(innerSimple(token));
		}
	}
	/**
	 * @param {TokenStreamItem} value
	 * @returns {[string, string | Array]}
	 */
	function innerSimple(value) {
		if (Array.isArray(value.content)) {
			return [value.type, toPrettyTokenStream(value.content, level + 1)];
		} else {
			return [value.type, value.content];
		}
	}

	prettyFormat(prettyStream, (level + 1) * 4);
	return prettyStream;
}

/**
 * @param {PrettyTokenStream} prettyStream
 * @param {number} indentationWidth
 * @returns {void}
 */
function prettyFormat(prettyStream, indentationWidth) {
	// The maximum number of (glued) tokens per line
	const MAX_TOKEN_PER_LINE = 5;
	// The maximum number of characters per line
	// (this is based on an estimation. The actual output might be longer.)
	const MAX_PRINT_WIDTH = 80 - indentationWidth;

	prettyTrimLineBreaks(prettyStream);
	// enable all line breaks with >=2 breaks in the source token stream
	prettyEnableLineBreaks(prettyStream, br => br.sourceCount >= 2);

	const ranges = prettySplit(prettyStream, br => br instanceof LineBreakItem && br.enabled);
	for (const group of ranges) {
		if (prettySomeLineBreak(group, true, br => br.enabled)) {
			// Since we just split by enabled line break, only nested line breaks can be enabled. This usually
			// indicates complex token streams, so let's just enable all line breaks and call it a day.
			prettyEnableLineBreaks(group, () => true);
		} else {
			// try to optimize for the pattern /<token>{1,MAX_TOKEN_PER_LINE}(\n<token>{1,MAX_TOKEN_PER_LINE})*/
			const lines = prettySplit(group, i => i instanceof LineBreakItem);

			/**
			 * Returns whether lines can generally be glued together (no line breaks within lines and don't glue with
			 * nested tokens).
			 */
			function glueable() {
				return lines.every(g => {
					if (g.length > 1) {
						if (prettyContainsNonTriviallyNested(g)) {
							// the token with nested tokens might be glued together with other tokens and we can't allow
							// that to happen
							return false;
						} else {
							return true;
						}
					} else {
						// we can safely ignore all tokens that are on their own line
						return true;
					}
				});
			}
			function tokensPerLine() {
				return lines.map(g => prettyCountTokens(g, true));
			}
			/**
			 * Returns an estimate for the output length each line will have
			 */
			function widthPerLine() {
				return lines.map(g => {
					if (g.length > 1) {
						return g
							.map(item => {
								if (isToken(item)) {
									if (typeof item === 'string') {
										return ', '.length + JSON.stringify(item).length;
									} else {
										return ', '.length + JSON.stringify(item).length + ' '.length;
									}
								} else {
									return 0;
								}
							})
							.reduce((a, b) => a + b, 0) - ', '.length;
					} else {
						// we don't really care about the print width of a single-token line
						return 1;
					}
				});
			}

			const glueTokens = glueable()
				// at most this many tokens per line
				&& Math.max(...tokensPerLine()) <= MAX_TOKEN_PER_LINE
				// the output of each line can be at most this many characters long
				&& Math.max(...widthPerLine()) <= MAX_PRINT_WIDTH
				// We need to have at least 2 lines in this group OR this group isn't the only group in the stream.
				// This will prevent all tokens of a really short token stream to be glued together.
				&& (lines.length > 1 || ranges.length > 1);

			if (glueTokens) {
				prettyGlueTogetherAll(prettyStream, group);
			} else {
				const flatTokenCount = prettyCountTokens(group, false);
				const deepTokenCount = prettyCountTokens(group, true);
				if (
					// prevent a one-token-per-line situation
					flatTokenCount > lines.length &&
					// require at least 2 tokens per line on average
					deepTokenCount >= lines.length * 2
				) {
					prettyEnableLineBreaks(group, () => true);
				}
			}
		}
	}
}

/**
 * @param {PrettyTokenStream} prettyStream
 * @param {number} [indentationLevel]
 * @param {string} [indentationChar]
 * @returns {string}
 */
function printPrettyTokenStream(prettyStream, indentationLevel = 1, indentationChar = '    ') {
	// can't use tabs because the console will convert one tab to four spaces
	const indentation = new Array(indentationLevel + 1).join(indentationChar);

	let out = '';
	out += '[\n';

	let glued = false;
	prettyStream.forEach((item, i) => {
		if (item instanceof LineBreakItem) {
			if (item.enabled) {
				out += '\n';
			}
		} else if (item instanceof GlueItem) {
			out = out.trimEnd();
			if (out[out.length - 1] === ',') {
				out += ' ';
			}
			glued = true;
		} else {
			if (glued) {
				glued = false;
			} else {
				out += indentation;
			}

			if (typeof item === 'string') {
				out += JSON.stringify(item);
			} else {
				const name = item[0];
				const content = item[1];

				out += '[' + JSON.stringify(name) + ', ';

				if (typeof content === 'string') {
					// simple string literal
					out += JSON.stringify(content);
				} else if (content.length === 1 && typeof content[0] === 'string') {
					// token stream that only contains a single string literal
					out += JSON.stringify(content);
				} else {
					// token stream
					out += printPrettyTokenStream(content, indentationLevel + 1, indentationChar);
				}

				out += ']';
			}

			const lineEnd = (i === prettyStream.length - 1) ? '\n' : ',\n';
			out += lineEnd;
		}
	});
	out += indentation.substr(indentationChar.length) + ']';
	return out;
}

/**
 * Returns whether the given string is empty or contains only whitespace characters.
 *
 * @param {string} str
 * @returns {boolean}
 */
function isBlank(str) {
	return /^\s*$/.test(str);
}

/**
 * @param {string} str
 * @returns {number}
 */
function countLineBreaks(str) {
	return str.split(/\r\n?|\n/).length - 1;
}

/**
 * Trim all line breaks at the start and at the end of the pretty stream.
 *
 * @param {PrettyTokenStream} prettyStream
 * @returns {void}
 */
function prettyTrimLineBreaks(prettyStream) {
	let value;
	while ((value = prettyStream[0])) {
		if (value instanceof LineBreakItem) {
			prettyStream.shift();
		} else {
			break;
		}
	}
	while ((value = prettyStream[prettyStream.length - 1])) {
		if (value instanceof LineBreakItem) {
			prettyStream.pop();
		} else {
			break;
		}
	}
}

/**
 * Enables all line breaks in the pretty token stream (but not in nested token stream) that contain at least some
 * number of line breaks in the source token stream.
 *
 * @param {PrettyTokenStream} prettyStream
 * @param {(item: LineBreakItem) => boolean} cond
 */
function prettyEnableLineBreaks(prettyStream, cond) {
	prettyStream.forEach(token => {
		if (token instanceof LineBreakItem && cond(token)) {
			token.enabled = true;
		}
	});
}

/**
 * Splits the given pretty stream on all items for which `cond` return `true`. The items for which `cond` returns
 * `true` will not be part of any of the created streams. No empty streams will be returned.
 *
 * @param {PrettyTokenStream} prettyStream
 * @param {(item: PrettyTokenStreamItem) => boolean} cond
 * @returns {PrettyTokenStream[]}
 */
function prettySplit(prettyStream, cond) {
	/** @type {PrettyTokenStream[]} */
	const result = [];
	/** @type {PrettyTokenStream} */
	let current = [];
	for (const item of prettyStream) {
		if (cond(item)) {
			if (current.length > 0) {
				result.push(current);
				current = [];
			}
		} else {
			current.push(item);
		}
	}
	if (current.length > 0) {
		result.push(current);
		current = [];
	}
	return result;
}

/**
 * @param {PrettyTokenStream} prettyStream
 * @param {boolean} recursive
 * @param {(item: LineBreakItem) => boolean} cond
 * @returns {boolean}
 */
function prettySomeLineBreak(prettyStream, recursive, cond) {
	for (const item of prettyStream) {
		if (item instanceof LineBreakItem && cond(item)) {
			return true;
		} else if (recursive && isNested(item) && prettySomeLineBreak(item[1], true, cond)) {
			return true;
		}
	}
	return false;
}
/**
 * @param {PrettyTokenStream} prettyStream
 * @returns {boolean}
 */
function prettyContainsNonTriviallyNested(prettyStream) {
	for (const item of prettyStream) {
		if (isNested(item) && !isTriviallyNested(item)) {
			return true;
		}
	}
	return false;
}
/**
 * @param {PrettyTokenStream} prettyStream
 * @param {boolean} recursive
 * @returns {number}
 */
function prettyCountTokens(prettyStream, recursive) {
	let count = 0;
	for (const item of prettyStream) {
		if (isToken(item)) {
			count++;
			if (recursive && isNested(item) && !isTriviallyNested(item)) {
				count += prettyCountTokens(item[1], true);
			}
		}
	}
	return count;
}

/**
 * Adds glue between the given tokens in the given stream.
 *
 * @param {PrettyTokenStream} prettyStream
 * @param {string | [string, string | any[]]} prev
 * @param {string | [string, string | any[]]} next
 */
function prettyGlueTogether(prettyStream, prev, next) {
	// strings may appear more than once in the stream, so we have to search for tokens.
	if (typeof prev !== 'string') {
		let index = prettyStream.indexOf(prev);
		if (index === -1 || prettyStream[index + 1] !== next) {
			throw new Error('Cannot glue: At least one of the tokens is not part of the given token stream.');
		}
		prettyStream.splice(index + 1, 0, new GlueItem());
	} else {
		let index = prettyStream.indexOf(next);
		if (index === -1 || prettyStream[index - 1] !== prev) {
			throw new Error('Cannot glue: At least one of the tokens is not part of the given token stream.');
		}
		prettyStream.splice(index, 0, new GlueItem());
	}
}
/**
 * Glues together all token in the given slice of the given token stream.
 *
 * @param {PrettyTokenStream} prettyStream
 * @param {PrettyTokenStream} slice
 */
function prettyGlueTogetherAll(prettyStream, slice) {
	for (let i = 1, l = slice.length; i < l; i++) {
		const prev = slice[i - 1];
		const next = slice[i];
		if (isToken(prev) && isToken(next)) {
			prettyGlueTogether(prettyStream, prev, next);
		}
	}
}

/**
 * @param {PrettyTokenStreamItem} item
 * @returns {item is (string | [string, string | any[]])}
 */
function isToken(item) {
	return typeof item === 'string' || Array.isArray(item);
}

/**
 * @param {PrettyTokenStreamItem} item
 * @returns {item is [string, any[]]}
 */
function isNested(item) {
	return Array.isArray(item) && Array.isArray(item[1]);
}
/**
 * @param {PrettyTokenStreamItem} item
 * @returns {item is [string, [string]]}
 */
function isTriviallyNested(item) {
	return isNested(item) && item[1].length === 1 && typeof item[1][0] === 'string';
}
