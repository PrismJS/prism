import registry from '../registry.js';

/** @type {import('../types.d.ts').LanguageProto<'bbcode'>} */
const Self = {
	id: 'bbcode',
	alias: 'shortcode',
	grammar: {
		'tag': {
			pattern:
				/\[\/?[^\s=\]]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'"\]=]+))?(?:\s+[^\s=\]]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'"\]=]+))*\s*\]/,
			inside: {
				'tag': {
					pattern: /^\[\/?[^\s=\]]+/,
					inside: {
						'punctuation': /^\[\/?/,
					},
				},
				'attr-value': {
					pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'"\]=]+)/,
					inside: {
						'punctuation': [
							/^=/,
							{
								pattern: /^(\s*)["']|["']$/,
								lookbehind: true,
							},
						],
					},
				},
				'punctuation': /\]/,
				'attr-name': /[^\s=\]]+/,
			},
		},
	},
};

export default Self;

registry.add(Self);
