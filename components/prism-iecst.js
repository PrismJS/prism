Prism.languages.iecst = {
	'comment': [
		{
			pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\])\(\*[\s\S]*?(?:\*\)|$)/,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\])\{[\s\S]*?(?:\}|$)/,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true,
			greedy: true
		}
    ],
    'boolean': /\b(?:true|false|null)\b/,
	'class-name': /\b(?:END_)?(PROGRAM|CONFIGURATION|INTERFACE|FUNCTION_BLOCK|FUNCTION|ACTION|TRANSITION|TYPE|STRUCT|(?:INITIAL_)?STEP|NAMESPACE|LIBRARY|CHANNEL|FOLDER|RESOURCE|VAR_(?:GLOBAL|INPUT|PUTPUT|IN_OUT|ACCESS|TEMP|EXTERNAL|CONFIG)|VAR|METHOD|PROPERTY)\b/i,
	'keyword': /\b(?:(?:END_)?(?:IF|WHILE|REPEAT|CASE|FOR)|ELSE|FROM|THEN|ELSIF|DO|TO|BY|PRIVATE|PUBLIC|PROTECTED|CONSTANT|RETURN|EXIT|CONTINUE|GOTO|JMP|AT|RETAIN|NON_RETAIN|TASK|WITH|UNTIL|USING|EXTENDS|IMPLEMENTS|GET|SET|__TRY|__CATCH|__FINALLY|__ENDTRY)\b/,
	
    'string': {
		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
    },
    'variable': /\b(?:AT|BOOL|BYTE|(?:D|L)?WORD|U?(?:S|D|L)?INT|L?REAL|TIME(?:_OF_DAY)?|TOD|DT|DATE(?:_AND_TIME)?|STRING|ARRAY|ANY|POINTER)\b/,
    'symbol': /%[IQM][XBWDL][\d.]*|%[IQ][\d.]*/,
    'number': /\b(?:16#[0-9ABCDEF]*)|\b(?:2#[01_]*)|\b(?:(?:T|D|DT|TOD)#[0-9_mshmd:]*)|\b(?:[A-Z]*\#[0-9.,_]*)|\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    'function': /\b\w+(?=\()/,
    'operator': /\b(:?S?R?=>?|\+|\^|\-|&&?|\*\*?|\/|<=?|>=?|OR|AND|MOD|NOT|XOR|LE|GE|EQ|NE|GE|LT)\b/,
    'punctuation': /[\(\);]/,
    'type': {
		pattern: /#/i,
		lookbehind: true,
		alias: 'selector'
	},
};
