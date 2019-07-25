(function (Prism) {

	var stringPattern = /(["'])(?:\1\1|(?!\1)[\s\S])*\1(?!\1)/.source;

	var number = /\b(?:\d[\da-f]*x|\d+(?:\.\d+)?(?:e[+-]?\d+)?)\b/i;
	var numericConstant = {
		pattern: RegExp(stringPattern + '[bx]'),
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
		pattern: RegExp(stringPattern),
		greedy: true
	};

	var punctuation = /[$%@.(){}\[\];,\\]/;


	Prism.languages.sas = {
		'datalines': {
			pattern: /^(\s*)(?:(?:data)?lines|cards);[\s\S]+?^;/im,
			lookbehind: true,
			alias: 'string',
			inside: {
				'keyword': {
					pattern: /^(?:(?:data)?lines|cards)/i,
					lookbehind: true
				},
				'punctuation': /;/
			}
		},
		'proc-sql': {
			pattern: /^proc\s+sql(?:\s+[\w|=]+)?;(?:[\s\S]+?^(?:proc\s+\w+|quit|run|data);|(?:\r?\n|\r)[\s\S]+;)/im,
			inside: {
				'full-step': {
					pattern: /^proc\s+sql(?:\s+[\w|=]+)?;/i,
					inside: {
						'step': step,
						'argument': {
							pattern: /\w+(?==)/,
							alias: 'keyword'
						},
						'operator': /=/,
						'punctuation': /;/,
						'number': number,
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
			pattern: /((?:^|[\s])=?)%(?:ABORT|BQUOTE|BY|CMS|COPY|DISPLAY|DO|ELSE|END|EVAL|GLOBAL|GO|GOTO|IF|INC|INCLUDE|INDEX|INPUT|KTRIM|LENGTH|LET|LIST|LOCAL|NRBQUOTE|NRQUOTE|NRSTR|PUT|QKTRIM|QSCAN|QSUBSTR|QSYSFUNC|QUOTE|QUPCASE|RETURN|RUN|SCAN|STR|SUBSTR|SUPERQ|SYMDEL|SYMGLOBL|SYMLOCAL|SYMEXIST|SYSCALL|SYSEVALF|SYSEXEC|SYSFUNC|SYSGET|SYSRPUT|THEN|TO|TSO|UNQUOTE|UNTIL|UPCASE|WHILE|WINDOW)\b/i,
			lookbehind: true,
			alias: 'keyword'
		},
		'macro-declaration': {
			pattern: /^%macro[^;]+(?=;)/im,
			inside: {
				'keyword': /%macro/i,
			}
		},
		'macro-end': {
			pattern: /^%mend[^;]+(?=;)/im,
			inside: {
				'keyword': /%mend/i,
			}
		},
		/*%_zscore(headcir, _lhc, _mhc, _shc, headcz, headcpct, _Fheadcz); */
		'macro': {
			pattern: /%_\w+(?=\()/,
			alias: 'keyword'
		},
		'input': {
			pattern: /\binput\s+[-\w\s/*.$&]+;/i,
			inside: {
				'input': {
					alias: 'keyword',
					pattern: /^input/i,
				},
				'comment': comment,
				'number': number,
				'numeric-constant': numericConstant
			}
		},
		'comment': comment,
		'options': {
			pattern: /^options[-'"|/\\<>*+=:()\w\s]*(?=;)/im,
			inside: {
				'options': {
					alias: 'keyword',
					pattern: /^options/i,
				},
				'arg-value': {
					pattern: /(=)[A-Z]+/i,
					lookbehind: true
				},
				'operator': /=/,
				'arg': {
					pattern: /[A-Z]+/i,
					alias: 'keyword'
				},
				'number': number,
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
			pattern: /\b(?:format|put)\b=?[\w'$.]+/im,
			inside: {
				'keyword': /^(?:format|put)(?=\=)/i,
				'equals': /=/,
				'format': {
					pattern: /(?:\w|\$\d)+\.\d?/i,
					alias: 'number'
				}
			}
		},
		'altformat': {
			pattern: /\b(?:format|put)\s+[\w']+(?:\s+[$.\w]+)+(?=;)/i,
			inside: {
				'keyword': /^(?:format|put)/i,
				'format': {
					pattern: /[\w$]+\.\d?/,
					alias: 'number'
				}
			}
		},
		'numeric-constant': numericConstant,
		'datetime': {
			// '1jan2013'd, '9:25:19pm't, '18jan2003:9:27:05am'dt
			pattern: RegExp(stringPattern + '(?:dt?|t)'),
			alias: 'number'
		},
		'string': string,
		'step': step,
		'keyword': {
			pattern: /((?:^|[\s])=?)(?:action|after|analysis|and|array|barchart|barwidth|begingraph|by|cas|cbarline|cfill|close|column|computed?|contains|data(?=\=)|define|document|do\s+over|do|dol|drop|dul|end|entryTitle|else|endcomp|fill(?:attrs)?|filename|group(?:by)?|headline|headskip|histogram|if|infile|keep|label|layout|legendlabel|length|libname|merge|midpoints|name|noobs|nowd|ods|or|out(?:put)?|overlay|plot|ranexp|rannor|rbreak|retain|set|session|sessref|statgraph|sum|summarize|table|temp|then\sdo|then|title|to|var|where|xaxisopts|yaxisopts|y2axisopts)\b/i,
			lookbehind: true,
		},
		// In SAS Studio syntax highlighting, these operators are styled like keywords
		'operator-keyword': {
			pattern: /\b(?:eq|ne|gt|lt|ge|le|in|not)\b/i,
			alias: 'operator'
		},
		// Decimal (1.2e23), hexadecimal (0c1x)
		'number': number,
		'operator': /\*\*?|\|\|?|!!?|¦¦?|<[>=]?|>[<=]?|[-+\/=&]|[~¬^]=?/i,
		'punctuation': punctuation
	};

}(Prism));
