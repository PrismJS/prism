import c from './c';
import type { GrammarOptions, LanguageProto } from '../types';

export default {
	id: 'bison',
	base: c,
	grammar ({ base }: GrammarOptions) {
		return {
			$insertBefore: {
				'comment': {
					'bison': {
						// This should match all the beginning of the file
						// including the prologue(s), the bison declarations and
						// the grammar rules.
						pattern: /^(?:[^%]|%(?!%))*%%[\s\S]*?%%/,
						inside: {
							'c': {
								// Allow for one level of nested braces
								pattern: /%\{[\s\S]*?%\}|\{(?:\{[^}]*\}|[^{}])*\}/,
								inside: {
									'delimiter': {
										pattern: /^%?\{|%?\}$/,
										alias: 'punctuation',
									},
									'bison-variable': {
										pattern: /[$@](?:<[^\s>]+>)?[\w$]+/,
										alias: 'variable',
										inside: {
											'punctuation': /<|>/,
										},
									},
									$rest: base,
								},
							},
							'comment': base.comment,
							'string': base.string,
							'property': /\S+(?=:)/,
							'keyword': /%\w+/,
							'number': {
								pattern: /(^|[^@])\b(?:0x[\da-f]+|\d+)/i,
								lookbehind: true,
							},
							'punctuation': /%[%?]|[|:;\[\]<>]/,
						},
					},
				},
			},
		};
	},
} as LanguageProto<'bison'>;
