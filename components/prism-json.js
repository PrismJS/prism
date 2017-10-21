Prism.languages.json = {
	'property': /"(?:\\.|[^\\"])*"(?=\s*:)/ig,
	'string': {
		pattern: /"(?:\\.|[^\\"])*"(?!:)/g,
		greedy: true
	},
	'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee][+-]?\d+)?)\b/g,
	'punctuation': /[{}[\]);,]/g,
	'operator': /:/g,
	'boolean': /\b(true|false)\b/gi,
	'null': /\bnull\b/gi
};

Prism.languages.jsonp = Prism.languages.json;
