import type { LanguageProto } from '../types';

export default {
	id: 'iecst',
	grammar: {
		'comment': [
			{
				pattern: /(^|[^\\])(?:\/\*[\s\S]*?(?:\*\/|$)|\(\*[\s\S]*?(?:\*\)|$)|\{[\s\S]*?(?:\}|$))/,
				lookbehind: true,
				greedy: true,
			},
			{
				pattern: /(^|[^\\:])\/\/.*/,
				lookbehind: true,
				greedy: true,
			},
		],
		'string': {
			pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
			greedy: true,
		},
		'keyword': [
			/\b(?:END_)?(?:ACTION|CHANNEL|CONFIGURATION|FOLDER|FUNCTION|FUNCTION_BLOCK|(?:INITIAL_)?STEP|INTERFACE|LIBRARY|METHOD|NAMESPACE|PROGRAM|PROPERTY|RESOURCE|STRUCT|TRANSITION|TYPE|VAR|VAR_(?:ACCESS|CONFIG|EXTERNAL|GLOBAL|INPUT|IN_OUT|OUTPUT|TEMP))\b/i,
			/\b(?:AT|BY|(?:END_)?(?:CASE|FOR|IF|REPEAT|WHILE)|CONSTANT|CONTINUE|DO|ELSE|ELSIF|EXIT|EXTENDS|FROM|GET|GOTO|IMPLEMENTS|JMP|NON_RETAIN|OF|PRIVATE|PROTECTED|PUBLIC|RETAIN|RETURN|SET|TASK|THEN|TO|UNTIL|USING|WITH|__CATCH|__ENDTRY|__FINALLY|__TRY)\b/
		],
		'class-name': /\b(?:ANY|ARRAY|BOOL|BYTE|DATE(?:_AND_TIME)?|U?(?:D|L|S)?INT|DT|(?:D|L)?WORD|L?REAL|POINTER|STRING|TIME(?:_OF_DAY)?|TOD)\b/,
		'address': {
			pattern: /%[IQM][XBWDL][\d.]*|%[IQ][\d.]*/,
			alias: 'symbol'
		},
		'number': /\b(?:16#[\da-f]+|2#[01_]+|0x[\da-f]+)\b|\b(?:D|DT|T|TOD)#[\d_shmd:]*|\b[A-Z]*#[\d.,_]*|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
		'boolean': /\b(?:FALSE|NULL|TRUE)\b/,
		'operator': /S?R?:?=>?|&&?|\*\*?|<[=>]?|>=?|[-:^/+#]|\b(?:AND|EQ|EXPT|GE|GT|LE|LT|MOD|NE|NOT|OR|XOR)\b/,
		'function': /\b[a-z_]\w*(?=\s*\()/i,
		'punctuation': /[()[\].,;]/,
	}
} as LanguageProto<'iecst'>;
