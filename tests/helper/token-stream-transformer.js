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
	 * @returns {string}
	 */
	prettyprint(tokenStream) {
		return printPrettyTokenStream(toPrettyTokenStream(tokenStream));
	}
};

class LineBreakItem {
	/**
	 * @param {number} sourceCount
	 */
	constructor(sourceCount) {
		this.sourceCount = sourceCount;
		this.enabled = false;
	}
}
class GlueItem {}

/**
 * @param {TokenStream} tokenStream
 * @returns {PrettyTokenStream}
 */
function toPrettyTokenStream(tokenStream) {
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
				const startLineBreaks = countLineBreaks((/^\s+/.exec(token) || [''])[0]);
				if (startLineBreaks > 0) {
					prettyStream.push(new LineBreakItem(startLineBreaks));
				}

				prettyStream.push(token);

				const endLineBreaks = countLineBreaks((/\s+$/.exec(token) || [''])[0]);
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
			return [value.type, toPrettyTokenStream(value.content)];
		} else {
			return [value.type, value.content];
		}
	}

	prettyTrimLineBreaks(prettyStream);

	// enable all line breaks with >=2 breaks
	prettyEnableLineBreaks(prettyStream, 2);

	prettySplit(prettyStream, br => br instanceof LineBreakItem && br.enabled).forEach((group, _, breaks) => {
		if (prettyContainsEnableLineBreaks(group, true)) {
			// at least one of the elements contains nested line breaks
			prettyEnableLineBreaks(group);
		} else {
			// try to optimize for the pattern /<token>{1,5}(\n<token>{1,5})*/
			const lines = prettySplit(group, i => i instanceof LineBreakItem);
			let doNotGlue = false;

			// check for line breaks within the line
			lines.forEach(g => {
				if (prettyContainsNonTriviallyNested(g)) {
					// we don't check those
				} else if (g.length >= 2) {
					const first = getStringContent(g[0]).trimStart();
					const last = getStringContent(g[g.length - 1]).trimEnd();
					if (countLineBreaks(first) > 0
						|| countLineBreaks(last) > 0
						|| g.slice(1, g.length - 2).some(t => countLineBreaks(getStringContent(t)) > 0)) {
						doNotGlue = true;
					} else {

					}
				}
			});

			// count the number of tokens per line
			const lineTokens = lines.map(g => {
				const count = prettyCountTokens(g, true);
				if (prettyContainsNonTriviallyNested(g)) {
					// nested tokens are fine as long as it's only one per line
					if (prettyCountTokens(g, false) === 1) {
						return count;
					} else {
						// it's more than one, so let's abort
						doNotGlue = true;
						return Infinity;
					}
				} else {
					return count;
				}
			});
			// estimate the output length each line will have
			const lineLengths = lines.map(g => {
				if (prettyContainsNonTriviallyNested(g)) {
					// can't say anything about that since they can't be printed as just one line
					return 0;
				} else {
					let count = -2;
					for (const item of g) {
						if (isToken(item)) {
							count += 2 + JSON.stringify(item).length;
						}
					}
					return count;
				}
			});
			const maxLineTokens = Math.max(...lineTokens);
			const maxLineLength = Math.max(...lineLengths);

			const glueTokens = !doNotGlue
				// at most this many tokens per line
				&& maxLineTokens <= 5
				// the output of each line can be at most this many characters long
				&& maxLineLength <= 80
				// We need to have at least 2 lines in this group OR this group isn't the only group in the stream.
				// This will prevent all tokens of a really short token stream to be glued together.
				&& (lines.length >= 2 || breaks.length >= 2);

			if (glueTokens) {
				prettyGlueTogetherAll(prettyStream, group);
			} else {
				const tokenCount = prettyCountTokens(group, true);
				if (tokenCount >= 8) {
					const lineBreakCount = prettyCountLineBreaks(group, false);

					if (tokenCount / (lineBreakCount + 1) > 2.1) {
						// the group contains a lot of tokens, so let's try to break it up
						// except when we have more than 1 line break per 2 tokens
						prettyEnableLineBreaks(group);
					}
				}
			}
		}
	});

	return prettyStream;
}

/**
 * @param {PrettyTokenStream} prettyStream
 * @param {number} [indentationLevel]
 * @returns {string}
 */
function printPrettyTokenStream(prettyStream, indentationLevel = 1) {
	const indentChar = '    ';

	// can't use tabs because the console will convert one tab to four spaces
	const indentation = new Array(indentationLevel + 1).join(indentChar);

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
					out += printPrettyTokenStream(content, indentationLevel + 1);
				}

				out += ']';
			}

			const lineEnd = (i === prettyStream.length - 1) ? '\n' : ',\n';
			out += lineEnd;
		}
	})
	out += indentation.substr(indentChar.length) + ']'
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
	return str.split(/\r\n?|\n/g).length - 1;
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
 * @param {number} minSourceCount
 */
function prettyEnableLineBreaks(prettyStream, minSourceCount = 0) {
	prettyStream.forEach(token => {
		if (token instanceof LineBreakItem && token.sourceCount >= minSourceCount) {
			token.enabled = true;
		}
	});
}

/**
 * Splits the given pretty stream on all enabled line breaks.
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
 * @returns {boolean}
 */
function prettyContainsEnableLineBreaks(prettyStream, recursive) {
	for (const item of prettyStream) {
		if (item instanceof LineBreakItem && item.enabled) {
			return true;
		} else if (recursive && isNested(item) && prettyContainsEnableLineBreaks(item[1], true)) {
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
		if (isNested(item)) {
			const nested = item[1];
			if (nested.length === 1 && typeof nested[0] === 'string') {
				// trivially nested
			} else {
				return true;
			}
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
			if (recursive && isNested(item)) {
				const nested = item[1];
				if (nested.length === 1 && typeof nested[0] === 'string') {
					// in this case, the token stream will be 'inlined' (kinda), so we don't need to count
				} else {
					count += prettyCountTokens(nested, true);
				}
			}
		}
	}
	return count;
}
/**
 * @param {PrettyTokenStream} prettyStream
 * @param {boolean} recursive
 * @param {(item: LineBreakItem) => boolean} [cond]
 * @returns {number}
 */
function prettyCountLineBreaks(prettyStream, recursive, cond) {
	let count = 0;
	for (const item of prettyStream) {
		if (item instanceof LineBreakItem) {
			if (!cond || cond(item)) {
				count++;
			}
		} else if (recursive && isNested(item)) {
			count += prettyCountLineBreaks(item[1], true, cond);
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
	if (typeof prev !== "string") {
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
 * Returns the string content of tokens. Non-trivially nested tokens will cause an error to be thrown.
 *
 * @param {PrettyTokenStreamItem} item
 * @returns {string}
 */
function getStringContent(item) {
	if (isToken(item)) {
		if (typeof item === "string") {
			return item;
		} else if (typeof item[1] === "string") {
			return item[1];
		} else {
			const first = item[1][0];
			if (typeof first === "string" && item[1].length === 1) {
				return first;
			} else {
				throw new Error("Nested token.");
			}
		}
	} else {
		throw Error("The given item is not a token.");
	}
}
