import { getTextContent } from '../core/token';
import { withoutTokenize } from '../shared/language-util';
import { tokenize } from '../shared/symbols';
import type { LanguageProto } from '../types';

function isBracketsBalanced(input: string): boolean {
	const brackets = '[]{}';
	const stack = [];
	for (let i = 0; i < input.length; i++) {
		const bracket = input[i];
		const bracketsIndex = brackets.indexOf(bracket);
		if (bracketsIndex !== -1) {
			if (bracketsIndex % 2 === 0) {
				stack.push(bracketsIndex + 1);
			} else if (stack.pop() !== bracketsIndex) {
				return false;
			}
		}
	}
	return stack.length === 0;
}

export default {
	id: 'naniscript',
	alias: 'nani',
	grammar() {
		const expressionDef = /\{[^\r\n\[\]{}]*\}/;

		const params = {
			'quoted-string': {
				pattern: /"(?:[^"\\]|\\.)*"/,
				alias: 'operator'
			},
			'command-param-id': {
				pattern: /(\s)\w+:/,
				lookbehind: true,
				alias: 'property'
			},
			'command-param-value': [
				{
					pattern: expressionDef,
					alias: 'selector',
				},
				{
					pattern: /([\t ])\S+/,
					lookbehind: true,
					greedy: true,
					alias: 'operator',
				},
				{
					pattern: /\S(?:.*\S)?/,
					alias: 'operator',
				}
			]
		};

		return {
			// ; ...
			'comment': {
				pattern: /^([\t ]*);.*/m,
				lookbehind: true,
			},
			// > ...
			// Define is a control line starting with '>' followed by a word, a space and a text.
			'define': {
				pattern: /^>.+/m,
				alias: 'tag',
				inside: {
					'value': {
						pattern: /(^>\w+[\t ]+)(?!\s)[^{}\r\n]+/,
						lookbehind: true,
						alias: 'operator'
					},
					'key': {
						pattern: /(^>)\w+/,
						lookbehind: true,
					}
				}
			},
			// # ...
			'label': {
				pattern: /^([\t ]*)#[\t ]*\w+[\t ]*$/m,
				lookbehind: true,
				alias: 'regex'
			},
			'command': {
				pattern: /^([\t ]*)@\w+(?=[\t ]|$).*/m,
				lookbehind: true,
				alias: 'function',
				inside: {
					'command-name': /^@\w+/,
					'expression': {
						pattern: expressionDef,
						greedy: true,
						alias: 'selector'
					},
					'command-params': {
						pattern: /\s*\S[\s\S]*/,
						inside: params
					},
				}
			},
			// Generic is any line that doesn't start with operators: ;>#@
			'generic-text': {
				pattern: /(^[ \t]*)[^#@>;\s].*/m,
				lookbehind: true,
				alias: 'punctuation',
				inside: {
					// \{ ... \} ... \[ ... \] ... \"
					'escaped-char': /\\[{}\[\]"]/,
					'expression': {
						pattern: expressionDef,
						greedy: true,
						alias: 'selector'
					},
					'inline-command': {
						pattern: /\[[\t ]*\w[^\r\n\[\]]*\]/,
						greedy: true,
						alias: 'function',
						inside: {
							'command-params': {
								pattern: /(^\[[\t ]*\w+\b)[\s\S]+(?=\]$)/,
								lookbehind: true,
								inside: params
							},
							'command-param-name': {
								pattern: /^(\[[\t ]*)\w+/,
								lookbehind: true,
								alias: 'name',
							},
							'start-stop-char': /[\[\]]/,
						}
					},
				}
			},

			[tokenize](code, grammar, Prism) {
				const tokens = Prism.tokenize(code, withoutTokenize(grammar));
				tokens.forEach((token) => {
					if (typeof token !== 'string' && token.type === 'generic-text') {
						const content = getTextContent(token);
						if (!isBracketsBalanced(content)) {
							token.type = 'bad-line';
							token.content = content;
						}
					}
				});
				return tokens;
			}
		};
	}
} as LanguageProto<'naniscript'>;
