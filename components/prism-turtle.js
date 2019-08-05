Prism.languages.turtle = {
	'comment': {
		pattern: /#.*/,
		greedy: true
	},
	'multilineString': {
		pattern: /(?:(?:"""(?:(?:[^"]|\n|\r)"?"?)*""")|(?:'''(?:(?:[^']|\n|\r)'?'?)*'''))/,
		greedy: true,
		alias: "string",
		inside: {
			'comment' : {
				pattern: /#.*/,
				greedy: true
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
	'punctuation': /(?:[\{\}\.,;\(\)\[\]]|\^\^)/,
	'boolean': /\b(?:true|false)\b/,
	'keyword': /(?:(?:\b(?:a|graph|base|prefix)|@prefix|@base)\b|\=)/i,
	'tag': /@(?:.)*\b/i,
};
Prism.languages.ttl = Prism.languages['turtle'];
Prism.languages.trig = Prism.languages['turtle'];