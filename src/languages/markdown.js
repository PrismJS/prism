import { getTextContent } from '../core/classes/token.js';
import { withoutTokenize } from '../util/language-util.js';
import markup from './markup.js';

/** @type {import('../types.d.ts').LanguageProto<'markdown'>} */
export default {
	id: 'markdown',
	base: markup,
	alias: 'md',
	grammar () {
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
		function createInline (pattern) {
			pattern = pattern.replace(/<inner>/g, () => inner);
			return RegExp(/((?:^|[^\\])(?:\\{2})*)/.source + '(?:' + pattern + ')');
		}

		const tableCell = /(?:\\.|``(?:[^`\r\n]|`(?!`))+``|`[^`\r\n]+`|[^\\|\r\n`])+/.source;
		const tableRow = /\|?__(?:\|__)+\|?(?:(?:\n|\r\n?)|(?![\s\S]))/.source.replace(
			/__/g,
			() => tableCell
		);
		const tableLine = /\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)+\|?(?:\n|\r\n?)/
			.source;

		const markdown = {
			'front-matter-block': {
				pattern: /(^(?:\s*[\r\n])?)---(?!.)[\s\S]*?[\r\n]---(?!.)/,
				lookbehind: true,
				greedy: true,
				inside: {
					'punctuation': /^---|---$/,
					'front-matter': {
						pattern: /\S+(?:\s+\S+)*/,
						alias: ['yaml', 'language-yaml'],
						inside: 'yaml',
					},
				},
			},
			'blockquote': {
				// > ...
				pattern: /^>(?:[\t ]*>)*/m,
				alias: 'punctuation',
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
								inside: 'markdown',
							},
							'punctuation': /\|/,
						},
					},
					'table-line': {
						pattern: RegExp('^(' + tableRow + ')' + tableLine + '$'),
						lookbehind: true,
						inside: {
							'punctuation': /\||:?-{3,}:?/,
						},
					},
					'table-header-row': {
						pattern: RegExp('^' + tableRow + '$'),
						inside: {
							'table-header': {
								pattern: RegExp(tableCell),
								alias: 'important',
								inside: 'markdown',
							},
							'punctuation': /\|/,
						},
					},
				},
			},
			'code': [
				{
					// Prefixed by 4 spaces or 1 tab and preceded by an empty line
					pattern:
						/((?:^|\n)[ \t]*\n|(?:^|\r\n?)[ \t]*\r\n?)(?: {4}|\t).+(?:(?:\n|\r\n?)(?: {4}|\t).+)*/,
					lookbehind: true,
					alias: 'keyword',
				},
				{
					// ```optional language
					// code block
					// ```
					pattern:
						/^```\s*(?:\{[^{}]*\}|[a-z+#:-]+)(?:[ \t][^\n\r]*)?(?:\n|\r\n?)[\s\S]*?(?:\n|\r\n?)```$/im,
					inside: {
						'code-block': {
							pattern: /^(```.*(?:\n|\r\n?))[\s\S]+?(?=(?:\n|\r\n?)```$)/,
							lookbehind: true,
						},
						'code-language': {
							pattern: /^(```\s*)(?:\{[^{}]*\}|[a-z+#:-]+)/i,
							lookbehind: true,
						},
						'punctuation': /```/,
						/** @type {Grammar['$tokenize']} */
						$tokenize (code, grammar, Prism) {
							const tokens = Prism.tokenize(code, withoutTokenize(grammar));
							const codeLang = tokens.find(
								t => typeof t !== 'string' && t.type === 'code-language'
							);
							const codeBlock = tokens.find(
								t => typeof t !== 'string' && t.type === 'code-block'
							);
							if (typeof codeLang !== 'object' || typeof codeBlock !== 'object') {
								return tokens;
							}

							let lang = getTextContent(codeLang);
							// Extract language code from curly braces like {r pressure, echo=FALSE} → r
							if (lang.startsWith('{') && lang.endsWith('}')) {
								const match = lang.slice(1, -1).match(/^\s*([a-z+#:-]+)/i);
								if (match) {
									// Not match[0] — that would keep the whitespace `\s*` skipped
									lang = match[1];
								}
							}
							// Apply transformations: c++ → cpp, c# → csharp, f# → fsharp, etc.
							lang = lang.replace(/\b#/g, 'sharp').replace(/\b\+\+/g, 'pp');
							lang = lang.toLowerCase();

							codeBlock.addAlias('language-' + lang);
							const blockGrammar =
								Prism.languageRegistry.getLanguage(lang)?.resolvedGrammar;
							if (blockGrammar) {
								codeBlock.content = Prism.tokenize(
									getTextContent(codeBlock),
									blockGrammar
								);
							}

							return tokens;
						},
					},
				},
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
						punctuation: /==+$|--+$/,
					},
				},
				{
					// # title 1
					// ###### title 6
					pattern: /(^\s*)#.+/m,
					lookbehind: true,
					alias: 'important',
					inside: {
						punctuation: /^#+|#+$/,
					},
				},
			],
			'hr': {
				// ***
				// ---
				// * * *
				// -----------
				pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
				lookbehind: true,
				alias: 'punctuation',
			},
			'list': {
				// * item
				// + item
				// - item
				// 1. item
				pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
				lookbehind: true,
				alias: 'punctuation',
			},
			'url-reference': {
				// [id]: http://example.com "Optional title"
				// [id]: http://example.com 'Optional title'
				// [id]: http://example.com (Optional title)
				// [id]: <http://example.com> "Optional title"
				pattern:
					/!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
				inside: {
					'variable': {
						pattern: /^(!?\[)[^\]]+/,
						lookbehind: true,
					},
					'string': /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
					'punctuation': /^[\[\]!:]|[<>]/,
				},
				alias: 'url',
			},
			'bold': {
				// **strong**
				// __strong__

				// allow one nested instance of italic text using the same delimiter
				pattern: createInline(
					/\b__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__\b|\*\*(?:(?!\*)<inner>|\*(?:(?!\*)<inner>)+\*)+\*\*/
						.source
				),
				lookbehind: true,
				greedy: true,
				inside: {
					'content': {
						pattern: /(^..)[\s\S]+(?=..$)/,
						lookbehind: true,
						inside: {}, // see below
					},
					'punctuation': /\*\*|__/,
				},
			},
			'italic': {
				// *em*
				// _em_

				// allow one nested instance of bold text using the same delimiter
				pattern: createInline(
					/\b_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_\b|\*(?:(?!\*)<inner>|\*\*(?:(?!\*)<inner>)+\*\*)+\*/
						.source
				),
				lookbehind: true,
				greedy: true,
				inside: {
					'content': {
						pattern: /(^.)[\s\S]+(?=.$)/,
						lookbehind: true,
						inside: {}, // see below
					},
					'punctuation': /[*_]/,
				},
			},
			'strike': {
				// ~~strike through~~
				// ~strike~
				// @ts-expect-error TS(2532): Ignore the non-existent capturing group error.
				pattern: createInline(/(~~?)(?:(?!~)<inner>)+\2/.source), // eslint-disable-line regexp/strict
				lookbehind: true,
				greedy: true,
				inside: {
					'content': {
						pattern: /(^~~?)[\s\S]+(?=\1$)/,
						lookbehind: true,
						inside: {}, // see below
					},
					'punctuation': /~~?/,
				},
			},
			'code-snippet': {
				// `code`
				// ``code``
				pattern: /(^|[^\\`])(?:``[^`\r\n]+(?:`[^`\r\n]+)*``(?!`)|`[^`\r\n]+`(?!`))/,
				lookbehind: true,
				greedy: true,
				alias: ['code', 'keyword'],
			},
			'url': {
				// [example](http://example.com "Optional title")
				// [example][id]
				// [example] [id]
				pattern: createInline(
					/!?\[(?:(?!\])<inner>)+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)|[ \t]?\[(?:(?!\])<inner>)+\])/
						.source
				),
				lookbehind: true,
				greedy: true,
				inside: {
					'operator': /^!/,
					'content': {
						pattern: /(^\[)[^\]]+(?=\])/,
						lookbehind: true,
						inside: {}, // see below
					},
					'variable': {
						pattern: /(^\][ \t]?\[)[^\]]+(?=\]$)/,
						lookbehind: true,
					},
					'url': {
						pattern: /(^\]\()[^\s)]+/,
						lookbehind: true,
					},
					'string': {
						pattern: /(^[ \t]+)"(?:\\.|[^"\\])*"(?=\)$)/,
						lookbehind: true,
					},
				},
			},
		};

		['url', 'bold', 'italic', 'strike'].forEach(token => {
			['url', 'bold', 'italic', 'strike', 'code-snippet'].forEach(inside => {
				if (token === inside) {
					return;
				}

				/** @type {Grammar} */ (
					/** @type {GrammarToken}*/ (
						/** @type {Grammar} */ (
							/** @type {GrammarToken} */ (markdown[token]).inside
						).content
					).inside
				)[inside] = markdown[inside];
			});
		});

		return {
			$insertBefore: {
				'prolog': markdown,
			},
		};
	},
};

/**
 * @typedef {import('../types.d.ts').Grammar} Grammar
 * @typedef {import('../types.d.ts').GrammarToken} GrammarToken
 */
