import { getTextContent } from '../core/token.js';
import { insertBefore, withoutTokenize } from '../shared/language-util.js';
import { tokenize } from '../shared/symbols.js';
import markup from './prism-markup.js';
import type { Grammar, GrammarToken, LanguageProto } from '../types';

export default {
	id: 'markdown',
	require: markup,
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
		 */
		function createInline(pattern: string) {
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
						'punctuation': /```/,
						[tokenize](code, grammar, Prism) {
							const tokens = Prism.tokenize(code, withoutTokenize(grammar));

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

							const codeLang = tokens[1];
							const codeBlock = tokens[3];

							if (
								typeof codeLang === 'object' && typeof codeBlock === 'object' &&
								codeLang.type === 'code-language' && codeBlock.type === 'code-block'
							) {

								// this might be a language that Prism does not support

								// do some replacements to support C++, C#, and F#
								const lang = getTextContent(codeLang.content)
									.replace(/\b#/g, 'sharp')
									.replace(/\b\+\+/g, 'pp');
								// only use the first word
								const langName = /[a-z][\w-]*/i.exec(lang)?.[0].toLowerCase();
								if (langName) {
									codeBlock.addAlias('language-' + langName);

									const grammar = Prism.components.getLanguage(lang);
									if (grammar) {
										codeBlock.content = Prism.tokenize(getTextContent(codeBlock), grammar);
									} else {
										codeBlock.addAlias('needs-highlighting');
									}
								}
							}

							return tokens;
						}
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
					((((markdown[token] as GrammarToken).inside as Grammar).content as GrammarToken).inside as Grammar)[inside] = markdown[inside];
				}
			});
		});

		return markdown;
	},
	effect(Prism) {
		return Prism.hooks.add('wrap', (env) => {
			if (!Prism.plugins.autoloader || env.type !== 'code-block' || !env.classes.includes('needs-highlighting')) {
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

			if (codeLang && codeLang !== 'none' && typeof document !== 'undefined') {
				const id = `md-${new Date().valueOf()}-${Math.floor(Math.random() * 1e16)}`;
				env.attributes['id'] = id;

				Prism.plugins.autoloader.loadLanguages(codeLang).then(() => {
					const element = document.getElementById(id);
					if (element) {
						element.innerHTML = Prism.highlight(element.textContent || '', codeLang);
					}
				}, (error) => console.error(error));
			}
		});

	}
} as LanguageProto<'markdown'>;
