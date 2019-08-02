Prism.languages.turtle = {
	'multilineString': {
		pattern: /"""(?:.|\n|\r)*"""/,
		greedy: true,
		alias: "string"
	},
	'string': {
		pattern: /"(?:[^\"\r\n]|\\")*"/,
		greedy: true
	},
	'url': {
		pattern: /<(?:[^ ])*>/,
		greedy: true
	},
	'comment': {
		pattern: /#.*/,
		greedy: true
	},
	'number': /\b[\+-]?\d+\.?\d*(e[+-]?\d+)?/i,
	'punctuation': /[\{\}\^\.,;\(\)\[\]]/,
	'function': /(?:[^: \r\n]*)?:(?:[^: \r\n]*)?/,
	'boolean': /\b(?:true|false)\b/,
	'keyword': /(?:\b(?:a|graph)|@prefix|@base|\=)\b/i,
	'tag': /@(?:.)*\b/i,
};
