(function (Prism) {

	numberpattern = /\b(?:\d[\da-f]*x|\d+(?:\.\d+)?(?:e[+-]?\d+)?)\b/i;
	numericconstant = {
	    pattern: /(["'])(?:\1\1|\\.|(!?\1)[^\\])\1[bx]/,
	    alias: 'number'
	};

	string = {
		pattern: /(["'])(?:\1\1|(?!\1)[\s\S])*\1/,
		greedy: true
	};

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
	'procSQL': {
		pattern: /(^|\n)(?:proc\s+sql(?:\s+[\w|=]+)?);([\s\S]+(?:\r?\n|\r)(?=((?:proc\s\w+|quit|run|data(?!\=));))((?:proc\s\w+|quit|run|data(?!\=));)|(?:\r?\n|\r)[\s\S]+;)/im,
		inside: {
			'fullStep': {
				pattern: /(^|\n)(?:proc\s+sql(?:\s+[\w|=]+)?);/i,
				inside: {
					'step': {
						pattern: /(?:proc\s\w+|quit|run|data(?!\=))\b/i,
						alias: 'keyword'
					},
					'argument': {
						pattern: /\w+(?==)/,
						alias: 'keyword'
					},
					'operator': /=/,
					'punctuation': /;/,
					'number': numberpattern,
					'numeric-constant': numericconstant,
					'string': string
				}
			},
			'step': {
				pattern: /(?:proc\s\w+|quit|run|data(?!\=))\b/i,
				alias: 'keyword'
			},
			rest: Prism.languages.sql
		}
	},
	'macrodeclaration': {
		pattern: /((^|\n)(%macro)((\s)+([\s\S]+?))+);/im,
		inside: {
			keyword: /%macro/im,
		}
	},
	'macroend': {
		pattern: /^%mend[\s\S]+?;/i,
		inside: {
			keyword: /%mend/i,
		}
	},
	/*%_zscore(headcir, _lhc, _mhc, _shc, headcz, headcpct, _Fheadcz); */
	'macro': {
		pattern: /%_\w+(?=\()/,
		alias: 'keyword'
	},
	'input': {
		pattern: /\binput\s+[-\w\s/*.$&]+;/i,
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
			'number': numberpattern,
			'numeric-constant': numericconstant
		}
	},
	'comment': [
		{
			pattern: /(^\s*|;\s*)\*(.|[\r\n])*?;/m,
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
			'number': numberpattern,
			'numeric-constant': numericconstant,
			'string': string
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
		pattern: /\b(?:(?:format|put)\s+)[\w']+(\s+[$.\w]+)+;/i,
		inside: {
			'keyword': /(format|put)/i,
			'format': {
					pattern: /(\w|\$)+\.\d?/,
					alias: 'number',
				},
				'punctuation': /;/
		}
	},
	'numeric-constant': numericconstant,
	'datetime': {
		// '1jan2013'd, '9:25:19pm't, '18jan2003:9:27:05am'dt
		pattern: /(["'])(?:.+)\1(?:dt?|t)/,
		alias: 'number'
	},
	'string': string,
	'step': {
		pattern: /(^|\n)(?:proc\s\w+|quit|run|data(?!\=))\b/i,
		alias: 'keyword'
	},
	'keyword': {
		pattern: /((^|[\s])=?)(?:action|after|analysis|and|array|barchart|barwidth|begingraph|by|cas|cbarline|cfill|close|column|compute(d)?|contains|data(?=\=)|define|document|do\s+over|do|dol|drop|dul|end|entryTitle|else|endcomp|fill(attrs)?|filename|group(by)?|headline|headskip|histogram|if|infile|keep|label|layout|legendlabel|length|libname|merge|midpoints|name|noobs|nowd|ods|or|out(put)?|overlay|ranexp|rannor|rbreak|retain|set|session|sessref|statgraph|sum|summarize|table|temp|then\sdo|then|title|to|var|where|xaxisopts|yaxisopts|y2axisopts)\b/i,
		lookbehind: true,
	},
	// In SAS Studio syntax highlighting, these operators are styled like keywords
	'specialOperator':{
		pattern: /\b(?:eq|ne|gt|lt|ge|le|in|not)\b/i,
		alias: 'operator'
	},
	// Decimal (1.2e23), hexadecimal (0c1x)
	'number': numberpattern,
	'operator': /\*\*?|\|\|?|!!?|¦¦?|<[>=]?|>[<=]?|[-+\/=&]|[~¬^]=?/i,
	'punctuation': /[$%@.(){}\[\];,\\]/
};
}(Prism));
