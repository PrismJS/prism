(function (Prism) {

	var numberPattern = /\b(?:\d[\da-f]*x|\d+(?:\.\d+)?(?:e[+-]?\d+)?)\b/i;
	var numericConstant = {
			pattern: /(["'])(?:\1\1|\\.|(!?\1)[^\\])\1[bx]/,
			alias: 'number'
	};

	var step = {
		pattern: /(?:proc\s+\w+|quit|run|data(?!\=))\b/i,
		alias: 'keyword'
	};

	var comment = [
		{
			pattern: /(^\s*|;\s*)\*[^;]*;/m,
			lookbehind: true
		},
		/\/\*[\s\S]+?\*\//
	];

	var string = {
		pattern: /(["'])(?:\1\1|(?!\1)[\s\S])*\1/,
		greedy: true
	};

	var punctuation = /[$%@.(){}\[\];,\\]/;

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
			pattern: /(^|\n)(?:proc\s+sql(?:\s+[\w|=]+)?);([\s\S]+(?:\r?\n|\r)(?=((?:proc\s+\w+|quit|run|data(?!\=));))((?:proc\s+\w+|quit|run|data(?!\=));)|(?:\r?\n|\r)[\s\S]+;)/im,
			inside: {
				'fullStep': {
					pattern: /(^|\n)(?:proc\s+sql(?:\s+[\w|=]+)?);/i,
					inside: {
						'step': step,
						'argument': {
							pattern: /\w+(?==)/,
							alias: 'keyword'
						},
						'operator': /=/,
						'punctuation': /;/,
						'number': numberPattern,
						'numeric-constant': numericConstant,
						'string': string
					}
				},
				'step': step,
				rest: Prism.languages.sql
			}
		},
		/*Special keywords within macros*/
		'macro-keyword': {
			pattern: /((^|[\s])=?)%(?:ABORT|BQUOTE|BY|CMS|COPY|DISPLAY|DO|ELSE|END|EVAL|GLOBAL|GO|GOTO|IF|INC|INCLUDE|INDEX|INPUT|KTRIM|LENGTH|LET|LIST|LOCAL|NRBQUOTE|NRQUOTE|NRSTR|PUT|QKTRIM|QSCAN|QSUBSTR|QSYSFUNC|QUOTE|QUPCASE|RETURN|RUN|SCAN|STR|SUBSTR|SUPERQ|SYMDEL|SYMGLOBL|SYMLOCAL|SYMEXIST|SYSCALL|SYSEVALF|SYSEXEC|SYSFUNC|SYSGET|SYSRPUT|THEN|TO|TSO|UNQUOTE|UNTIL|UPCASE|WHILE|WINDOW)\b/i,
			lookbehind: true,
			alias: 'keyword'
		},
		'macro-declaration': {
			pattern: /^%macro[\s\S]+?;/im,
			inside: {
				keyword: /%macro/i,
				'punctuation': /;/
			}
		},
		'macro-end': {
			pattern: /^%mend[\s\S]+?;/im,
			inside: {
				keyword: /%mend/i,
				'punctuation': /;/
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
				'comment': comment,
				'number': numberPattern,
				'numeric-constant': numericConstant
			}
		},
		'comment': comment,
		'options': {
			pattern: /^options[-'"|/\\<>*+=:()\w\s]*;/im,
			inside: {
				'options': {
					alias: 'keyword',
					pattern: /^options/i,
				},
				'argValue': {
					pattern: /(=)([A-Z]+)/i,
					lookbehind: true
				},
				'equals': {
					pattern: /=/,
					alias: 'operator'
				},
				'arg': {
					pattern: /([A-Z]+)/i,
					alias: 'keyword'
				},
				'number': numberPattern,
				'numeric-constant': numericConstant,
				'punctuation': punctuation,
				'string': string
			},
		},
		'function': {
			pattern: /%?\w+(?=\()/,
			alias: 'keyword'
		},
		'format': {
			pattern: /(\b)(?:((format)|(put))(?:=?))([\w\'\$\.]+)/im,
			inside: {
				'keyword': /(format|put)(?=\=)/i,

				'equals': {
							pattern: /=/,
							alias: 'operator'
						},
				'format': {
						pattern: /(\w|\$\d)+\.\d?/i,
						alias: 'number',
					}
			}
		},
		'altformat': {
			pattern: /\b(?:format|put)\s+[\w']+(?:\s+[$.\w]+)+;/i,
			inside: {
				'keyword': /(format|put)/i,
				'format': {
						pattern: /(\w|\$)+\.\d?/,
						alias: 'number',
					},
					'punctuation': /;/
			}
		},
		'numeric-constant': numericConstant,
		'datetime': {
			// '1jan2013'd, '9:25:19pm't, '18jan2003:9:27:05am'dt
			pattern: /(["'])(?:.+)\1(?:dt?|t)/,
			alias: 'number'
		},
		'string': string,
		'step': step,
		'keyword': {
			pattern: /((^|[\s])=?)(?:action|after|analysis|and|array|barchart|barwidth|begingraph|by|cas|cbarline|cfill|close|column|compute(d)?|contains|data(?=\=)|define|document|do\s+over|do|dol|drop|dul|end|entryTitle|else|endcomp|fill(attrs)?|filename|group(by)?|headline|headskip|histogram|if|infile|keep|label|layout|legendlabel|length|libname|merge|midpoints|name|noobs|nowd|ods|or|out(put)?|overlay|plot|ranexp|rannor|rbreak|retain|set|session|sessref|statgraph|sum|summarize|table|temp|then\sdo|then|title|to|var|where|xaxisopts|yaxisopts|y2axisopts)\b/i,
			lookbehind: true,
		},
		// In SAS Studio syntax highlighting, these operators are styled like keywords
		'operator-keyword':{
			pattern: /\b(?:eq|ne|gt|lt|ge|le|in|not)\b/i,
			alias: 'operator'
		},
		// Decimal (1.2e23), hexadecimal (0c1x)
		'number': numberPattern,
		'operator': /\*\*?|\|\|?|!!?|¦¦?|<[>=]?|>[<=]?|[-+\/=&]|[~¬^]=?/i,
		'punctuation': punctuation
	};
}(Prism));
