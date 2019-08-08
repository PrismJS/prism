(function (Prism) {

	var stringPattern = /(?:"(?:""|[^"])*"(?!")|'(?:''|[^'])*'(?!'))/.source;

	var number = /\b(?:\d[\da-f]*x|\d+(?:\.\d+)?(?:e[+-]?\d+)?)\b/i;
	var numericConstant = {
		pattern: RegExp(stringPattern + '[bx]'),
		alias: 'number'
	};

	var step = {
		pattern: /(^|\s+)(?:proc\s+\w+|quit|run|data(?!\=))\b/i,
		alias: 'keyword',
		lookbehind: true
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

	var args = {
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
	};

	var globalStatements = {
		pattern: /((?:^|[\s])=?)(?:catname|checkpoint execute_always|dm|endsas|filename|footnote|%include|libname|%list|lock|missing|options|page|resetline|%run|sasfile|skip|sysecho|title\d?)\b/i,
		lookbehind: true,
		alias: 'keyword'
	};

	Prism.languages.sas = {
		'datalines': {
			pattern: /^(\s*)(?:(?:data)?lines|cards);[\s\S]+?^;/im,
			lookbehind: true,
			alias: 'string',
			inside: {
				'keyword': {
					pattern: /^(?:(?:data)?lines|cards)/i
				},
				'punctuation': /;/
			}
		},

		'proc-sql': {
			pattern: /(^proc\s+(?:fed)?sql(?:\s+[\w|=]+)?;)[\s\S]+?(?=^(?:proc\s+\w+|quit|run|data);|(?![\s\S]))/im,
			lookbehind: true,
			inside: {
				'sql': {
					pattern: RegExp(/^[ \t]*(?:select|alter\s+table|(?:create|describe|drop)\s+(?:index|table(?:\s+constraints)?|view)|create\s+unique\s+index|insert\s+into|update)(?:<str>|[^;"'])+;/.source.replace(/<str>/g, stringPattern), 'im'),
					alias: 'language-sql',
					inside: Prism.languages.sql
				},
				'global-statements': globalStatements,
				'sql-statements': {
					pattern: /(^|\s)(?:disconnect\s+from|exec(?:ute)?|begin|commit|rollback|reset|validate)\b/i,
					lookbehind: true,
					alias: 'keyword'
				},
				'number': number,
				'numeric-constant': numericConstant,
				'punctuation': punctuation,
				'string': string
			}
		},

		'proc-args': {
			pattern: RegExp(/(^proc\s+\w+\s+)(?!\s)(?:[^;"']|<str>)+;/.source.replace(/<str>/g, stringPattern), 'im'),
			lookbehind: true,
			inside: args
		},

		/*Special keywords within macros*/
		'macro-keyword': {
			pattern: /((?:^|\s)=?)%(?:ABORT|BQUOTE|BY|CMS|COPY|DISPLAY|DO|ELSE|END|EVAL|GLOBAL|GO|GOTO|IF|INC|INCLUDE|INDEX|INPUT|KTRIM|LENGTH|LET|LIST|LOCAL|NRBQUOTE|NRQUOTE|NRSTR|PUT|QKTRIM|QSCAN|QSUBSTR|QSYSFUNC|QUOTE|QUPCASE|RETURN|RUN|SCAN|STR|SUBSTR|SUPERQ|SYMDEL|SYMGLOBL|SYMLOCAL|SYMEXIST|SYSCALL|SYSEVALF|SYSEXEC|SYSFUNC|SYSGET|SYSRPUT|THEN|TO|TSO|UNQUOTE|UNTIL|UPCASE|WHILE|WINDOW)\b/i,
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
		'options-args': {
			pattern: /(^options)[-'"|/\\<>*+=:()\w\s]*(?=;)/im,
			lookbehind: true,
			inside: args
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
			pattern: /((?:^|\s)=?)(?:action|after|analysis|and|array|barchart|barwidth|begingraph|by|cas|cbarline|cfill|close|column|computed?|contains|data(?=\=)|define|document|do\s+over|do|dol|drop|dul|end|entryTitle|else|endcomp|fill(?:attrs)?|filename|group(?:by)?|headline|headskip|histogram|if|infile|keep|label|layout|legendlabel|length|libname|merge|midpoints|name|noobs|nowd|ods|options|or|out(?:put)?|overlay|plot|ranexp|rannor|rbreak|retain|set|session|sessref|statgraph|sum|summarize|table|temp|then\sdo|then|title\d?|to|var|where|xaxisopts|yaxisopts|y2axisopts)\b/i,
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
