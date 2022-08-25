import { insertBefore } from '../shared/language-util.js';
import markup from './prism-markup.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'markdown',
	require: markup,
	optional: 'yaml',
	alias: 'md',
	grammar({ extend }) {
		// Allow only one line break
		const inner = /(?:\\.|[^\\\n\r]|(?:\n|\r\n?)(?![\r\n]))/.source;

		/**
		 * This function is intended for the creation of the bold or italic pattern.
		 *
		 * This also adds a lookbehind group to the given pattern to ensure that the pattern is not backslash-escaped.
		 *
		 * _Note:_ Keep in mind that this adds a capturing group.
		 *
		 * @param {string} pattern
		 * @returns {RegExp}
		 */
		function createInline(pattern) {
			pattern = pattern.replace(/<inner>/g, () => inner);
			return RegExp(/((?:^|[^\\])(?:\\{2})*)/.source + '(?:' + pattern + ')');
		}


		const tableCell = /(?:\\.|``(?:[^`\r\n]|`(?!`))+``|`[^`\r\n]+`|[^\\|\r\n`])+/.source;
		const tableRow = /\|?__(?:\|__)+\|?(?:(?:\n|\r\n?)|(?![\s\S]))/.source.replace(/__/g, () => tableCell);
		const tableLine = /\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)+\|?(?:\n|\r\n?)/.source;


		const markdown = extend('markup', {});
		insertBefore(markdown, 'prolog', {
			'front-matter-block': {
				pattern: /(^(?:\s*[\r\n])?)---(?!.)[\s\S]*?[\r\n]---(?!.)/,
				lookbehind: true,
				greedy: true,
				inside: {
					'punctuation': /^---|---$/,
					'front-matter': {
						pattern: /\S+(?:\s+\S+)*/,
						alias: ['yaml', 'language-yaml'],
						inside: 'yaml'
					}
				}
			},
			'blockquote': {
				// > ...
				pattern: /^>(?:[\t ]*>)*/m,
				alias: 'punctuation'
			},
			'table': {
				pattern: RegExp('^' + tableRow + tableLine + '(?:' + tableRow + ')*', 'm'),
				inside: {
					'table-data-rows': {
						pattern: RegExp('^(' + tableRow + tableLine + ')(?:' + tableRow + ')*$'),
						lookbehind: true,
						inside: {
							'table-data': {
								pattern: RegExp(tableCell),
								inside: 'markdown'
							},
							'punctuation': /\|/
						}
					},
					'table-line': {
						pattern: RegExp('^(' + tableRow + ')' + tableLine + '$'),
						lookbehind: true,
						inside: {
							'punctuation': /\||:?-{3,}:?/
						}
					},
					'table-header-row': {
						pattern: RegExp('^' + tableRow + '$'),
						inside: {
							'table-header': {
								pattern: RegExp(tableCell),
								alias: 'important',
								inside: 'markdown'
							},
							'punctuation': /\|/
						}
					}
				}
			},
			'code': [
				{
					// Prefixed by 4 spaces or 1 tab and preceded by an empty line
					pattern: /((?:^|\n)[ \t]*\n|(?:^|\r\n?)[ \t]*\r\n?)(?: {4}|\t).+(?:(?:\n|\r\n?)(?: {4}|\t).+)*/,
					lookbehind: true,
					alias: 'keyword'
				},
				{
					// ```optional language
					// code block
					// ```
					pattern: /^```[\s\S]*?^```$/m,
					greedy: true,
					inside: {
						'code-block': {
							pattern: /^(```.*(?:\n|\r\n?))[\s\S]+?(?=(?:\n|\r\n?)^```$)/m,
							lookbehind: true
						},
						'code-language': {
							pattern: /^(```).+/,
							lookbehind: true
						},
						'punctuation': /```/
					}
				}
			],
			'title': [
				{
					// title 1
					// =======

					// title 2
					// -------
					pattern: /\S.*(?:\n|\r\n?)(?:==+|--+)(?=[ \t]*$)/m,
					alias: 'important',
					inside: {
						punctuation: /==+$|--+$/
					}
				},
				{
					// # title 1
					// ###### title 6
					pattern: /(^\s*)#.+/m,
					lookbehind: true,
					alias: 'important',
					inside: {
						punctuation: /^#+|#+$/
					}
				}
			],
			'hr': {
				// ***
				// ---
				// * * *
				// -----------
				pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
				lookbehind: true,
				alias: 'punctuation'
			},
			'list': {
				// * item
				// + item
				// - item
				// 1. item
				pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
				lookbehind: true,
				alias: 'punctuation'
			},
			'url-reference': {
				// [id]: http://example.com "Optional title"
				// [id]: http://example.com 'Optional title'
				// [id]: http://example.com (Optional title)
				// [id]: <http://example.com> "Optional title"
				pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
				inside: {
					'variable': {
						pattern: /^(!?\[)[^\]]+/,
						lookbehind: true
					},
					'string': /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
					'punctuation': /^[\[\]!:]|[<>]/
				},
				alias: 'url'
			},
			'bold': {
				// **strong**
				// __strong__

				// allow one nested instance of italic text using the same delimiter
				pattern: createInline(/\b__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__\b|\*\*(?:(?!\*)<inner>|\*(?:(?!\*)<inner>)+\*)+\*\*/.source),
				lookbehind: true,
				greedy: true,
				inside: {
					'content': {
						pattern: /(^..)[\s\S]+(?=..$)/,
						lookbehind: true,
						inside: {} // see below
					},
					'punctuation': /\*\*|__/
				}
			},
			'italic': {
				// *em*
				// _em_

				// allow one nested instance of bold text using the same delimiter
				pattern: createInline(/\b_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_\b|\*(?:(?!\*)<inner>|\*\*(?:(?!\*)<inner>)+\*\*)+\*/.source),
				lookbehind: true,
				greedy: true,
				inside: {
					'content': {
						pattern: /(^.)[\s\S]+(?=.$)/,
						lookbehind: true,
						inside: {} // see below
					},
					'punctuation': /[*_]/
				}
			},
			'strike': {
				// ~~strike through~~
				// ~strike~
				// eslint-disable-next-line regexp/strict
				pattern: createInline(/(~~?)(?:(?!~)<inner>)+\2/.source),
				lookbehind: true,
				greedy: true,
				inside: {
					'content': {
						pattern: /(^~~?)[\s\S]+(?=\1$)/,
						lookbehind: true,
						inside: {} // see below
					},
					'punctuation': /~~?/
				}
			},
			'code-snippet': {
				// `code`
				// ``code``
				pattern: /(^|[^\\`])(?:``[^`\r\n]+(?:`[^`\r\n]+)*``(?!`)|`[^`\r\n]+`(?!`))/,
				lookbehind: true,
				greedy: true,
				alias: ['code', 'keyword']
			},
			'url': {
				// [example](http://example.com "Optional title")
				// [example][id]
				// [example] [id]
				pattern: createInline(/!?\[(?:(?!\])<inner>)+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)|[ \t]?\[(?:(?!\])<inner>)+\])/.source),
				lookbehind: true,
				greedy: true,
				inside: {
					'operator': /^!/,
					'content': {
						pattern: /(^\[)[^\]]+(?=\])/,
						lookbehind: true,
						inside: {} // see below
					},
					'variable': {
						pattern: /(^\][ \t]?\[)[^\]]+(?=\]$)/,
						lookbehind: true
					},
					'url': {
						pattern: /(^\]\()[^\s)]+/,
						lookbehind: true
					},
					'string': {
						pattern: /(^[ \t]+)"(?:\\.|[^"\\])*"(?=\)$)/,
						lookbehind: true
					}
				}
			}
		});

		['url', 'bold', 'italic', 'strike'].forEach((token) => {
			['url', 'bold', 'italic', 'strike', 'code-snippet'].forEach((inside) => {
				if (token !== inside) {
					markdown[token].inside.content.inside[inside] = markdown[inside];
				}
			});
		});

		return markdown;
	},
	effect(Prism) {
		const tagPattern = RegExp(Prism.components.getLanguage('markup').tag.pattern.source, 'gi');

		/**
		 * A list of known entity names.
		 *
		 * This will always be incomplete to save space. The current list is the one used by lowdash's unescape function.
		 *
		 * @see {@link https://github.com/lodash/lodash/blob/2da024c3b4f9947a48517639de7560457cd4ec6c/unescape.js#L2}
		 * @type {Partial<Record<string, string>>}
		 */
		const KNOWN_ENTITY_NAMES = {
			'amp': '&',
			'lt': '<',
			'gt': '>',
			'quot': '"',
		};

		/**
		 * Returns the text content of a given HTML source code string.
		 *
		 * @param {string} html
		 * @returns {string}
		 */
		function textContent(html) {
			// remove all tags
			let text = html.replace(tagPattern, '');

			// decode known entities
			text = text.replace(/&(\w{1,8}|#x?[\da-f]{1,8});/gi, (m, code) => {
				code = code.toLowerCase();

				if (code[0] === '#') {
					let value;
					if (code[1] === 'x') {
						value = parseInt(code.slice(2), 16);
					} else {
						value = Number(code.slice(1));
					}

					return String.fromCodePoint(value);
				} else {
					const known = KNOWN_ENTITY_NAMES[code];
					if (known) {
						return known;
					}

					// unable to decode
					return m;
				}
			});

			return text;
		}

		Prism.hooks.add('after-tokenize', (env) => {
			if (env.language !== 'markdown' && env.language !== 'md') {
				return;
			}

			function walkTokens(tokens) {
				if (!tokens || typeof tokens === 'string') {
					return;
				}

				for (let i = 0, l = tokens.length; i < l; i++) {
					const token = tokens[i];

					if (token.type !== 'code') {
						walkTokens(token.content);
						continue;
					}

					/*
					 * Add the correct `language-xxxx` class to this code block. Keep in mind that the `code-language` token
					 * is optional. But the grammar is defined so that there is only one case we have to handle:
					 *
					 * token.content = [
					 *     <span class="punctuation">```</span>,
					 *     <span class="code-language">xxxx</span>,
					 *     '\n', // exactly one new lines (\r or \n or \r\n)
					 *     <span class="code-block">...</span>,
					 *     '\n', // exactly one new lines again
					 *     <span class="punctuation">```</span>
					 * ];
					 */

					const codeLang = token.content[1];
					const codeBlock = token.content[3];

					if (codeLang && codeBlock &&
							codeLang.type === 'code-language' && codeBlock.type === 'code-block' &&
							typeof codeLang.content === 'string') {

						// this might be a language that Prism does not support

						// do some replacements to support C++, C#, and F#
						let lang = codeLang.content.replace(/\b#/g, 'sharp').replace(/\b\+\+/g, 'pp');
						// only use the first word
						lang = (/[a-z][\w-]*/i.exec(lang) || [''])[0].toLowerCase();
						const alias = 'language-' + lang;

						// add alias
						if (!codeBlock.alias) {
							codeBlock.alias = [alias];
						} else if (typeof codeBlock.alias === 'string') {
							codeBlock.alias = [codeBlock.alias, alias];
						} else {
							codeBlock.alias.push(alias);
						}
					}
				}
			}

			walkTokens(env.tokens);
		});

		Prism.hooks.add('wrap', (env) => {
			if (env.type !== 'code-block') {
				return;
			}

			let codeLang = '';
			for (let i = 0, l = env.classes.length; i < l; i++) {
				const cls = env.classes[i];
				const match = /language-(.+)/.exec(cls);
				if (match) {
					codeLang = match[1];
					break;
				}
			}

			const grammar = Prism.components.getLanguage(codeLang);

			if (!grammar) {
				if (codeLang && codeLang !== 'none' && Prism.plugins.autoloader) {
					const id = 'md-' + new Date().valueOf() + '-' + Math.floor(Math.random() * 1e16);
					env.attributes['id'] = id;

					Prism.plugins.autoloader.loadLanguages(codeLang, () => {
						const ele = document.getElementById(id);
						if (ele) {
							ele.innerHTML = Prism.highlight(ele.textContent, Prism.languages[codeLang], codeLang);
						}
					});
				}
			} else {
				env.content = Prism.highlight(textContent(env.content), grammar, codeLang);
			}
		});

	}
});
