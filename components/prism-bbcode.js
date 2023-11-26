export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['bbcode']) {
      return
    }
	Prism.languages.bbcode = {
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
	};

	Prism.languages.shortcode = Prism.languages.bbcode;
}