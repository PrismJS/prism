Prism.languages.css.selector = {
	pattern: Prism.languages.css.selector,
	inside: {
		'pseudo-element': /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
		'pseudo-class': {
			pattern: /:[-\w]+(?:\((?:[^()]|\([^()]*\))*\))?/,
			inside: {
				'selector': {
					pattern: /(^:(?:has|host|host-context|is|not|where)\()[\s\S]+(?=\)$)/,
					lookbehind: true,
					alias: 'argument',
					inside: null
				},
				'argument': {
					pattern: /(^:[-\w]+\()[\s\S]+(?=\)$)/,
					lookbehind: true,
					inside: {
						// an + b
						'number': /\b\d*[\dn]\b/,
						'operator': /[-+]/
					}
				},
				'punctuation': /[()]/
			}
		},
		'class': /\.[-:.\w]+/,
		'id': /#[-:.\w]+/,
		'attribute': /\[[^\]]+\]/
	}
};

Prism.languages.css.selector.inside['pseudo-class'].inside['selector'].inside = Prism.languages.css.selector.inside;

Prism.languages.insertBefore('css', 'property', {
	'variable': {
		pattern: /(^|[^-\w\xA0-\uFFFF])--[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*/i,
		lookbehind: true
	}
});

Prism.languages.insertBefore('css', 'function', {
	'operator': {
		pattern: /(\s)[+\-*\/](?=\s)/,
		lookbehind: true
	},
	'hexcode': /#[\da-f]{3,8}/i,
	'entity': /\\[\da-f]{1,8}/i,
	'unit': {
		pattern: /(\d)(?:%|[a-z]+)/,
		lookbehind: true
	},
	'number': /-?[\d.]+/
});
