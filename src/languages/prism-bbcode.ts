import type { LanguageProto } from '../types';

export default {
	id: 'bbcode',
	alias: 'shortcode',
	grammar: {
		'tag': {
			pattern: /\[\/?[^\s=\]]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'"\]=]+))?(?:\s+[^\s=\]]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'"\]=]+))*\s*\]/,
			inside: {
				'tag': {
					pattern: /^\[\/?[^\s=\]]+/,
					inside: {
						'punctuation': /^\[\/?/
					}
				},
				'attr-value': {
					pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'"\]=]+)/,
					inside: {
						'punctuation': [
							/^=/,
							{
								pattern: /^(\s*)["']|["']$/,
								lookbehind: true
							}
						]
					}
				},
				'punctuation': /\]/,
				'attr-name': /[^\s=\]]+/
			}
		}
	}
} as LanguageProto<'bbcode'>;
