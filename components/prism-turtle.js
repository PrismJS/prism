Prism.languages.turtle = {
	'comment': {
		pattern: /#.*/,
		greedy: true
	},
	'multiline-string': {
		pattern: /"""(?:[^"]"?"?)*"""|'''(?:[^']'?'?)*'''/,
		greedy: true,
		alias: 'string',
		inside: {
			'comment': /#.*/
		}
	},
	'string': {
		pattern: /"(?:[^\\"\r\n]|\\.)*"|'(?:[^\\'\r\n]|\\.)*'/,
		greedy: true
	},
	'url': {
		pattern: /<[^\s<>]*>/,
		greedy: true,
		inside: {
			'punctuation': /[<>]/
		}
	},
	'function': {
		pattern: /(?:(?![-._\d\xB7])[-.\w\xB7\xC0-\uFFFD]+)?:(?:(?![-.])(?:[-.:\w\xC0-\uFFFD]|%[\da-f]{2}|\\.)+)?/i,
		inside: {
			'prefix': {
				pattern: /(?:(?![-._\d\xB7])[-.\w\xB7\xC0-\uFFFD]+)?:/i,
				inside: {
					'punctuation': /:/
				}
			},
			'local-name': /(?![-.])(?:[-.:\w\xC0-\uFFFD]|%[\da-f]{2}|\\.)+/i
		}
	},
	'number': /[+-]?\b\d+\.?\d*(?:e[+-]?\d+)?/i,
	'punctuation': /[{}.,;()[\]]|\^\^/,
	'boolean': /\b(?:true|false)\b/,
	'keyword': /(?:\ba|@prefix|@base)\b|=/,
	'case-insensitive-keyword': {
		pattern: /\b(?:graph|base|prefix)\b|=/i,
		alias: 'keyword'
	},
	'tag': {
		'pattern': /@[a-z]+(?:-[a-z\d]+)*/i,
		inside: {
			'punctuation': /@/
		}
	}
};
Prism.languages.trig = Prism.languages['turtle'];
