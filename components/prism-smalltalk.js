Prism.languages.smalltalk = {
	'comment': /"(?:""|[^"])*"/,
	'character': {
		pattern: /\$./,
		alias: 'string'
	},
	'string': /'(?:''|[^'])*'/,
	'symbol': /#[\da-z]+|#(?:-|([+\/\\*~<>=@%|&?!])\1?)|#(?=\()/i,
	'block-arguments': {
		pattern: /(\[\s*):[^\[|]*\|/,
		lookbehind: true,
		inside: {
			'variable': /:[\da-z]+/i,
			'punctuation': /\|/
		}
	},
	'temporary-variables': {
		pattern: /\|[^|]+\|/,
		inside: {
			'variable': /[\da-z]+/i,
			'punctuation': /\|/
		}
	},
	'keyword': /\b(?:false|new|nil|self|super|true)\b/,
	'number': [
		/\d+r-?[\dA-Z]+(?:\.[\dA-Z]+)?(?:e-?\d+)?/,
		/\b\d+(?:\.\d+)?(?:e-?\d+)?/
	],
	'operator': /[<=]=?|:=|~[~=]|\/\/?|\\\\|>[>=]?|[!^+\-*&|,@]/,
	'punctuation': /[.;:?\[\](){}]/
};
