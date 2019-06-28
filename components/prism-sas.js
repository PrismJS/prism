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
	// TODO: Explore why this does not work
	// 'procSQL': {
	// 	pattern: /(^|\n)(?:proc\s+sql);[\s\S]+?(?:\r?\n|\r)(?:proc\s\w+|quit|run|data(?!\=));/im,
	// 	alias: 'string',
	// 	inside: {
	// 		'step': {
	// 			pattern: /(^|\n)(?:proc\s+sql)/i,
	// 			alias: 'keyword'
	// 		},
	// 		rest: Prism.languages.sql
	// 	}
	// },
	'input': {
		pattern: /(\b)+(?:input(?!\=))\s+(?:\w|\$|\&|\s|\-|\.|\/|\*)+;/im,
		inside:{
			'input':{
				alias: 'keyword',
				pattern: /^input/i,
			},
			'comment': [
				{
					pattern: /(^\s*|;\s*)\*.*;/m,
					lookbehind: true
				},
				/\/\*[\s\S]+?\*\//
			],
			'number': /\b(?:[\da-f]+x(?!\w+)|\d+(?:\.\d+)?(?:e[+-]?\d+)?)/i,
		}
	},
	'comment': [
		{
			pattern: /(^\s*|;\s*)\*.*;/m,
			lookbehind: true
		},
		/\/\*[\s\S]+?\*\//
	],
	'options': {
		pattern: /(^options)(?:((?:\s+?)(?:\r?\n|\r)*[\'\-|\"\/\\<>\*\w+=\(\)]*)*;)/im,
		inside: {
			'options': {
				alias: 'keyword',
				pattern: /(^options)/i,
			},
			'equals': {
				pattern: /=/,
				alias: 'operator'
			},
			'parentheses': {
				pattern: /(\()([A-Z]+)(\))/i,
			},
			'arg': {
				pattern: /([A-Z]+)/im,
				alias: 'keyword'
			},
			'number': /\b(?:[\da-f]+x(?!\w+)|\d+(?:\.\d+)?(?:e[+-]?\d+)?)/,
			'string': {
				pattern: /(["'])(?:\1\1|(?!\1)[\s\S])*\1/,
				greedy: true
			}
		},
	},
	'function': {
		pattern: /\w+(?=\()/,
		alias: 'keyword'
	},
	'format': {
		pattern: /(\b)(?:((format)|(put))(?:=?))([\w\'\$\.]+)/im,
		inside: {
			'keyword': /(format|put)(?=\=)/im,

			'equals': {
						pattern: /=/,
						alias: 'operator'
					},
			'format': {
					pattern: /(\w|\$\d)+\.\d?/im,
					alias: 'number',
				}
		}
	},
	'altformat': {
		pattern: /(\b)(?:((format)|(put))(?:\s)+)([\w\'])+((\s)+([\$\.\w]+))+;/im,
		inside: {
			'keyword': /(format|put)/im,
			'format': {
					pattern: /(\w|\$)+\.\d?/im,
					alias: 'number',
				},
				'punctuation': /;/
		}
	},
	'datetime': {
		// '1jan2013'd, '9:25:19pm't, '18jan2003:9:27:05am'dt
		pattern: /'[^']+'(?:dt?|t)\b/i,
		alias: 'number'
	},
	'string': {
		pattern: /(["'])(?:\1\1|(?!\1)[\s\S])*\1/,
		greedy: true
	},
			//TODO: Add handling for proc sql
	'step': {
		pattern: /(^|\n)(?:proc\s\w+|quit|run|data(?!\=))\b/i,
		alias: 'keyword'
	},
	'keyword': {
		pattern: /((^|[\s])=?)(?:action|after|analysis|and|barchart|barwidth|begingraph|cas|cbarline|cfill|close|column|compute(d)?|contains|data(?=\=)|define|document|do|dol|drop|dul|end|entryTitle|else|endcomp|fill(attrs)?|filename|group(by)?|headline|headskip|histogram|if|infile|label|layout|legendlabel|length|libname|midpoints|name|noobs|nowd|ods|or|out(put)?|overlay|ranexp|rannor|rbreak|retain|set|sessref|statgraph|sum|summarize|table|temp|then\sdo|then|title|to|var|where|xaxisopts|yxisopts|y2axisopts)\b/i,
		lookbehind: true,
	},
	// In SAS Studio syntax highlighting, these operators are styled like keywords
	'specialOperator':{
		pattern: /\b(?:eq|ne|gt|lt|ge|le|in|not)\b/i,
		alias: 'operator'
	},
	// Decimal (1.2e23), hexadecimal (0c1x)
	'number': /\b(?:[\da-f]+x(?!\w+)|\d+(?:\.\d+)?(?:e[+-]?\d+)?)/i,
	'operator': /\*\*?|\|\|?|!!?|¦¦?|<[>=]?|>[<=]?|[-+\/=&]|[~¬^]=?/i,
	'punctuation': /[$%@.(){}\[\];,\\]/
};
