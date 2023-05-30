import { withoutTokenize } from '../shared/language-util';
import { tokenize } from '../shared/symbols';
import type { Token } from '../core';
import type { LanguageProto } from '../types';

export default {
	id: 'graphql',
	grammar: {
		'comment': /#.*/,
		'description': {
			pattern: /(?:"""(?:[^"]|(?!""")")*"""|"(?:\\.|[^\\"\r\n])*")(?=\s*[a-z_])/i,
			greedy: true,
			alias: 'string',
			inside: {
				'language-markdown': {
					pattern: /(^"(?:"")?)(?!\1)[\s\S]+(?=\1$)/,
					lookbehind: true,
					inside: 'markdown'
				}
			}
		},
		'string': {
			pattern: /"""(?:[^"]|(?!""")")*"""|"(?:\\.|[^\\"\r\n])*"/,
			greedy: true
		},
		'number': /(?:\B-|\b)\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
		'boolean': /\b(?:false|true)\b/,
		'variable': /\$[a-z_]\w*/i,
		'directive': {
			pattern: /@[a-z_]\w*/i,
			alias: 'function'
		},
		'attr-name': {
			pattern: /\b[a-z_]\w*(?=\s*(?:\((?:[^()"]|"(?:\\.|[^\\"\r\n])*")*\))?:)/i,
			greedy: true
		},
		'atom-input': {
			pattern: /\b[A-Z]\w*Input\b/,
			alias: 'class-name'
		},
		'scalar': /\b(?:Boolean|Float|ID|Int|String)\b/,
		'constant': /\b[A-Z][A-Z_\d]*\b/,
		'class-name': {
			pattern: /(\b(?:enum|implements|interface|on|scalar|type|union)\s+|&\s*|:\s*|\[)[A-Z_]\w*/,
			lookbehind: true
		},
		'fragment': {
			pattern: /(\bfragment\s+|\.{3}\s*(?!on\b))[a-zA-Z_]\w*/,
			lookbehind: true,
			alias: 'function'
		},
		'definition-mutation': {
			pattern: /(\bmutation\s+)[a-zA-Z_]\w*/,
			lookbehind: true,
			alias: 'function'
		},
		'definition-query': {
			pattern: /(\bquery\s+)[a-zA-Z_]\w*/,
			lookbehind: true,
			alias: 'function'
		},
		'keyword': /\b(?:directive|enum|extend|fragment|implements|input|interface|mutation|on|query|repeatable|scalar|schema|subscription|type|union)\b/,
		'operator': /[!=|&]|\.{3}/,
		'property-query': /\w+(?=\s*\()/,
		'object': /\w+(?=\s*\{)/,
		'punctuation': /[!(){}\[\]:=,]/,
		'property': /\w+/,
		[tokenize](code, grammar, Prism) {
			const tokens = Prism.tokenize(code, withoutTokenize(grammar));

			function isToken(token: Token | string): token is Token {
				return typeof token !== 'string';
			}

			/**
			 * get the graphql token stream that we want to customize
			 */
			const validTokens = tokens
				.filter(isToken)
				.filter((token) => token.type !== 'comment' && token.type !== 'scalar');

			let currentIndex = 0;

			/**
			 * Returns whether the token relative to the current index has the given type.
			 */
			function getToken(offset = 0): Token {
				return validTokens[currentIndex + offset];
			}

			/**
			 * Returns whether the token relative to the current index has the given type.
			 */
			function isTokenType(types: readonly string[], offset = 0): boolean {
				for (let i = 0; i < types.length; i++) {
					const token = getToken(i + offset);
					if (!token || token.type !== types[i]) {
						return false;
					}
				}
				return true;
			}

			/**
			 * Returns the index of the closing bracket to an opening bracket.
			 *
			 * It is assumed that `token[currentIndex - 1]` is an opening bracket.
			 *
			 * If no closing bracket could be found, `-1` will be returned.
			 */
			function findClosingBracket(open: RegExp, close: RegExp): number {
				let stackHeight = 1;

				for (let i = currentIndex; i < validTokens.length; i++) {
					const token = validTokens[i];
					const content = token.content;

					if (token.type === 'punctuation' && typeof content === 'string') {
						if (open.test(content)) {
							stackHeight++;
						} else if (close.test(content)) {
							stackHeight--;

							if (stackHeight === 0) {
								return i;
							}
						}
					}
				}

				return -1;
			}

			for (; currentIndex < validTokens.length;) {
				const startToken = validTokens[currentIndex++];

				// add special aliases for mutation tokens
				if (startToken.type === 'keyword' && startToken.content === 'mutation') {
					// any array of the names of all input variables (if any)
					const inputVariables = [];

					if (isTokenType(['definition-mutation', 'punctuation']) && getToken(1).content === '(') {
						// definition

						currentIndex += 2; // skip 'definition-mutation' and 'punctuation'

						const definitionEnd = findClosingBracket(/^\($/, /^\)$/);
						if (definitionEnd === -1) {
							continue;
						}

						// find all input variables
						for (; currentIndex < definitionEnd; currentIndex++) {
							const t = getToken(0);
							if (t.type === 'variable') {
								t.addAlias('variable-input');
								inputVariables.push(t.content);
							}
						}

						currentIndex = definitionEnd + 1;
					}

					if (isTokenType(['punctuation', 'property-query']) && getToken(0).content === '{') {
						currentIndex++; // skip opening bracket

						getToken(0).addAlias('property-mutation');

						if (inputVariables.length > 0) {
							const mutationEnd = findClosingBracket(/^\{$/, /^\}$/);
							if (mutationEnd === -1) {
								continue;
							}

							// give references to input variables a special alias
							for (let i = currentIndex; i < mutationEnd; i++) {
								const varToken = validTokens[i];
								if (varToken.type === 'variable' && inputVariables.includes(varToken.content)) {
									varToken.addAlias('variable-input');
								}
							}
						}
					}
				}
			}

			return tokens;
		}
	}
} as LanguageProto<'graphql'>;
