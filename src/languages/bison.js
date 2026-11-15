import c from './c.js';

/** @type {import('../types.d.ts').LanguageProto<'bison'>} */
export default {
	id: 'bison',
	base: c,
	grammar ({ base }) {
		return {
			$insert: {
				'bison': {
					$before: 'comment',
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
								$rest: 'c',
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
		};
	},
};
