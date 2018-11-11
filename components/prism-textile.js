(function(Prism) {
	// We don't allow for pipes inside parentheses
	// to not break table pattern |(. foo |). bar |
	var modifierRegex = '(?:\\([^|)]+\\)|\\[[^\\]]+\\]|\\{[^}]+\\})+';
	var modifierTokens = {
		'css': {
			pattern: /\{[^}]+\}/,
			inside: {
				rest: Prism.languages.css
			}
		},
		'class-id': {
			pattern: /(\()[^)]+(?=\))/,
			lookbehind: true,
			alias: 'attr-value'
		},
		'lang': {
			pattern: /(\[)[^\]]+(?=\])/,
			lookbehind: true,
			alias: 'attr-value'
		},
		// Anything else is punctuation (the first pattern is for row/col spans inside tables)
		'punctuation': /[\\\/]\d+|\S/
	};


	/**
	 * Creates a new RegExp using `Prism.patterns.build` and `{ mod: modifierRegex }`.
	 *
	 * @param {string|RegExp} basePattern
	 * @returns {RegExp}
	 */
	function buildWithModifier(basePattern) {
		return Prism.patterns.build(basePattern, { mod: modifierRegex });
	}

	Prism.languages.textile = Prism.languages.extend('markup', {
		'phrase': {
			pattern: /(^|\r|\n)\S[\s\S]*?(?=$|\r?\n\r?\n|\r\r)/,
			lookbehind: true,
			inside: {

				// h1. Header 1
				'block-tag': {
					pattern: buildWithModifier('^[a-z]\\w*(?:<<mod>>|[<>=()])*\\.'),
					inside: {
						'modifier': {
							pattern: buildWithModifier('(^[a-z]\\w*)(?:<<mod>>|[<>=()])+(?=\\.)'),
							lookbehind: true,
							inside: modifierTokens
						},
						'tag': /^[a-z]\w*/,
						'punctuation': /\.$/
					}
				},

				// # List item
				// * List item
				'list': {
					pattern: buildWithModifier(/^[*#]+<<mod>>?\s+.+/m),
					inside: {
						'modifier': {
							pattern: buildWithModifier('(^[*#]+)<<mod>>'),
							lookbehind: true,
							inside: modifierTokens
						},
						'punctuation': /^[*#]+/
					}
				},

				// | cell | cell | cell |
				'table': {
					// Modifiers can be applied to the row: {color:red}.|1|2|3|
					// or the cell: |{color:red}.1|2|3|
					pattern: buildWithModifier(/^(?:(?:<<mod>>|[<>=()^~])+\.\s*)?(?:\|(?:(?:<<mod>>|[<>=()^~_]|[\\/]\d+)+\.)?[^|]*)+\|/m),
					inside: {
						'modifier': {
							// Modifiers for rows after the first one are
							// preceded by a pipe and a line feed
							pattern: buildWithModifier('(^|\\|(?:\\r?\\n|\\r)?)(?:<<mod>>|[<>=()^~_]|[\\\\/]\\d+)+(?=\\.)'),
							lookbehind: true,
							inside: modifierTokens
						},
						'punctuation': /\||^\./
					}
				},

				'inline': {
					pattern: buildWithModifier('(\\*\\*|__|\\?\\?|[*_%@+\\-^~])<<mod>>?.+?\\1'),
					inside: {
						// Note: superscripts and subscripts are not handled specifically

						// *bold*, **bold**
						'bold': {
							pattern: buildWithModifier('(^(\\*\\*?)<<mod>>?).+?(?=\\2)'),
							lookbehind: true
						},

						// _italic_, __italic__
						'italic': {
							pattern: buildWithModifier('(^(__?)<<mod>>?).+?(?=\\2)'),
							lookbehind: true
						},

						// ??cite??
						'cite': {
							pattern: buildWithModifier('(^\\?\\?<<mod>>?).+?(?=\\?\\?)'),
							lookbehind: true,
							alias: 'string'
						},

						// @code@
						'code': {
							pattern: buildWithModifier('(^@<<mod>>?).+?(?=@)'),
							lookbehind: true,
							alias: 'keyword'
						},

						// +inserted+
						'inserted': {
							pattern: buildWithModifier('(^\\+<<mod>>?).+?(?=\\+)'),
							lookbehind: true
						},

						// -deleted-
						'deleted': {
							pattern: buildWithModifier('(^-<<mod>>?).+?(?=-)'),
							lookbehind: true
						},

						// %span%
						'span': {
							pattern: buildWithModifier('(^%<<mod>>?).+?(?=%)'),
							lookbehind: true
						},

						'modifier': {
							pattern: buildWithModifier('(^\\*\\*|__|\\?\\?|[*_%@+\\-^~])<<mod>>'),
							lookbehind: true,
							inside: modifierTokens
						},
						'punctuation': /[*_%?@+\-^~]+/
					}
				},

				// [alias]http://example.com
				'link-ref': {
					pattern: /^\[[^\]]+\]\S+$/m,
					inside: {
						'string': {
							pattern: /(\[)[^\]]+(?=\])/,
							lookbehind: true
						},
						'url': {
							pattern: /(\])\S+$/,
							lookbehind: true
						},
						'punctuation': /[\[\]]/
					}
				},

				// "text":http://example.com
				// "text":link-ref
				'link': {
					pattern: buildWithModifier('"<<mod>>?[^"]+":.+?(?=[^\\w/]?(?:\\s|$))'),
					inside: {
						'text': {
							pattern: buildWithModifier('(^"<<mod>>?)[^"]+(?=")'),
							lookbehind: true
						},
						'modifier': {
							pattern: buildWithModifier('(^")<<mod>>'),
							lookbehind: true,
							inside: modifierTokens
						},
						'url': {
							pattern: /(:).+/,
							lookbehind: true
						},
						'punctuation': /[":]/
					}
				},

				// !image.jpg!
				// !image.jpg(Title)!:http://example.com
				'image': {
					pattern: buildWithModifier('!(?:<<mod>>|[<>=()])*[^!\\s()]+(?:\\([^)]+\\))?!(?::.+?(?=[^\\w/]?(?:\\s|$)))?'),
					inside: {
						'source': {
							pattern: buildWithModifier('(^!(?:<<mod>>|[<>=()])*)[^!\\s()]+(?:\\([^)]+\\))?(?=!)'),
							lookbehind: true,
							alias: 'url'
						},
						'modifier': {
							pattern: buildWithModifier('(^!)(?:<<mod>>|[<>=()])+'),
							lookbehind: true,
							inside: modifierTokens
						},
						'url': {
							pattern: /(:).+/,
							lookbehind: true
						},
						'punctuation': /[!:]/
					}
				},

				// Footnote[1]
				'footnote': {
					pattern: /\b\[\d+\]/,
					alias: 'comment',
					inside: {
						'punctuation': /\[|\]/
					}
				},

				// CSS(Cascading Style Sheet)
				'acronym': {
					pattern: /\b[A-Z\d]+\([^)]+\)/,
					inside: {
						'comment': {
							pattern: /(\()[^)]+(?=\))/,
							lookbehind: true
						},
						'punctuation': /[()]/
					}
				},

				// Prism(C)
				'mark': {
					pattern: /\b\((?:TM|R|C)\)/,
					alias: 'comment',
					inside: {
						'punctuation':/[()]/
					}
				}
			}
		}
	});

	var nestedPatterns = {
		'inline': Prism.languages.textile['phrase'].inside['inline'],
		'link': Prism.languages.textile['phrase'].inside['link'],
		'image': Prism.languages.textile['phrase'].inside['image'],
		'footnote': Prism.languages.textile['phrase'].inside['footnote'],
		'acronym': Prism.languages.textile['phrase'].inside['acronym'],
		'mark': Prism.languages.textile['phrase'].inside['mark']
	};

	// Only allow alpha-numeric HTML tags, not XML tags
	Prism.languages.textile.tag.pattern = /<\/?(?!\d)[a-z0-9]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i;

	// Allow some nesting
	Prism.languages.textile['phrase'].inside['inline'].inside['bold'].inside = nestedPatterns;
	Prism.languages.textile['phrase'].inside['inline'].inside['italic'].inside = nestedPatterns;
	Prism.languages.textile['phrase'].inside['inline'].inside['inserted'].inside = nestedPatterns;
	Prism.languages.textile['phrase'].inside['inline'].inside['deleted'].inside = nestedPatterns;
	Prism.languages.textile['phrase'].inside['inline'].inside['span'].inside = nestedPatterns;

	// Allow some styles inside table cells
	Prism.languages.textile['phrase'].inside['table'].inside['inline'] = nestedPatterns['inline'];
	Prism.languages.textile['phrase'].inside['table'].inside['link'] = nestedPatterns['link'];
	Prism.languages.textile['phrase'].inside['table'].inside['image'] = nestedPatterns['image'];
	Prism.languages.textile['phrase'].inside['table'].inside['footnote'] = nestedPatterns['footnote'];
	Prism.languages.textile['phrase'].inside['table'].inside['acronym'] = nestedPatterns['acronym'];
	Prism.languages.textile['phrase'].inside['table'].inside['mark'] = nestedPatterns['mark'];

}(Prism));