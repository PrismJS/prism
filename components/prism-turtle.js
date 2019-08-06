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
		pattern: /[^\s:^]*:[^\s:.;,(){}[\]^]*/,
		inside: {
			'prefix': /^[^:]+(?=:)/,
			'punctuation': /:/,
			'name': /[\s\S]+/
		}
	},
	'number': /[+-]?\b\d+\.?\d*(?:e[+-]?\d+)?/i,
	'punctuation': /[{}.,;()[\]]|\^\^/,
	'boolean': /\b(?:true|false)\b/,
	'keyword': /(?:\b(?:a|graph|base|prefix)|@prefix|@base)\b|=/i,
	'tag': {
		'pattern': /@[a-z]+(?:-[a-z\d]+)*/i,
		inside: {
			'punctuation': /@/
		}
	}
};
Prism.languages.trig = Prism.languages['turtle'];
