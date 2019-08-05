Prism.languages.turtle = {
	'comment': {
		pattern: /#.*/,
		greedy: true
	},
	'multiline-string': {
		pattern: /(?:(?:"""(?:(?:[^"]|\n|\r)"?"?)*""")|(?:'''(?:(?:[^']|\n|\r)'?'?)*'''))/,
		greedy: true,
		alias: 'string',
		inside: {
			'comment' : {
				pattern: /#.*/
			}
		}
	},
	'string': {
		pattern: /(?:(?:"(?:[^\"\r\n]|\\")*")|(?:'(?:[^\'\r\n]|\\')*'))/,
		greedy: true
	},
	'url': {
		pattern: /<(?:[^ ])*>/,
		greedy: true
	},
	'function': /\b(?:[^: \r\n]*)?:(?:[^: \r\n,.;\(\)\{\}\[\]\^\.]*)?/,
	'number': /[\+-]?\b\d+\.?\d*(?:e[+-]?\d+)?/i,
	'punctuation': /[{}.,;()[\]]|\^\^/,
	'boolean': /\b(?:true|false)\b/,
	'keyword': /(?:(?:\b(?:a|graph|base|prefix)|@prefix|@base)\b|\=)/i,
	'tag': /@(?:[a-zA-Z]+)(?:-[a-zA-Z0-9]+)*/,
};
Prism.languages.ttl = Prism.languages['turtle'];
Prism.languages.trig = Prism.languages['turtle'];
