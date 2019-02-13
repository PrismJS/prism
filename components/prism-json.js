Prism.languages.json = {
	'comment': /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
	'property': {
		pattern: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
		greedy: true
	},
	'string': {
		pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
		greedy: true
	},
	'number': /-?\d+\.?\d*(e[+-]?\d+)?/i,
	'punctuation': /[{}[\],]/,
	'operator': /:/,
	'boolean': {
		pattern: /\b(?:true|false)\b/,
		alias: 'keyword'
	},
	'null': {
		pattern: /\bnull\b/,
		alias: 'keyword'
	}
};

Prism.languages.jsonp = Prism.languages.json;
