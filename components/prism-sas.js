Prism.languages.sas = {
	'datalines': {
		pattern: /^\s*(?:(?:data)?lines|cards);[\s\S]+?(?:\r?\n|\r);/im,
		alias: 'string',
		inside: {
			'keyword': {
				pattern: /^(\s*)(?:(?:data)?lines|cards)/i,
				lookbehind: true
			},
			'punctuation': /;/
		}
	},
	'options': {
		pattern: /(^options)(?:((?:\s+?)(?:\r?\n|\r)*[\'\w+=\(\)]*)*;)/im,
		inside: {
			'options': {
				alias: 'keyword',
				pattern: /(^options)/i,
			},
		  'operator': /\*\*?|\|\|?|!!?|¦¦?|<[>=]?|>[<=]?|[-+\/=&]|[~¬^]=?|\b(?:eq|ne|gt|lt|ge|le|in|not)\b/i,
		  'keyword': {
		    pattern: /(\s)((\w+)(?:=?))/im,
		    lookbehind: true,
		  },
		  'punctuation': /[$%@.(){}\[\];,\\]/,
		  'number': /\b(?:[\da-f]+x(?!\w+)|\d+(?:\.\d+)?(?:e[+-]?\d+)?)/,
			'string': {
				pattern: /(["'])(?:\1\1|(?!\1)[\s\S])*\1/,
				greedy: true
			},
		}
	},
	'function': {
		pattern: /\w+(?=\()/,
		alias: 'keyword'
	},
	'comment': [
		{
			pattern: /(^\s*|;\s*)\*.*;/m,
			lookbehind: true
		},
		/\/\*[\s\S]+?\*\//
	],
	'datetime': {
		// '1jan2013'd, '9:25:19pm't, '18jan2003:9:27:05am'dt
		pattern: /'[^']+'(?:dt?|t)\b/i,
		alias: 'number'
	},
	'string': {
		pattern: /(["'])(?:\1\1|(?!\1)[\s\S])*\1/,
		greedy: true
	},
	'function-name': /\b(?:data|proc\s\w+|quit|run)\b/i,
	'keyword': /\b(=)?(?:close|define|column|analysis|sum|headline|headskip|rbreak|after|dol|dul|summarize|noobs|compute|endcomp|where|contains|midpoints|cfill|fill|title|histogram|rannor|ranexp|cbarline|var|name|document|ods|drop|else|format|do|end|to|if|input|label|length|retain|proc\s\w+|quit|run|then|then\sdo|libname|set|output)\b/i,
	// Decimal (1.2e23), hexadecimal (0c1x)
	'number': /\b(?:[\da-f]+x(?!\w+)|\d+(?:\.\d+)?(?:e[+-]?\d+)?)/,
	'operator': /\*\*?|\|\|?|!!?|¦¦?|<[>=]?|>[<=]?|[-+\/=&]|[~¬^]=?|\b(?:eq|ne|gt|lt|ge|le|in|not)\b/i,
	'punctuation': /[$%@.(){}\[\];,\\]/
};
