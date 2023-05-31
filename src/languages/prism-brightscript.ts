import type { LanguageProto } from '../types';

export default {
	id: 'brightscript',
	grammar: {
		'comment': /(?:\brem|').*/i,
		'directive-statement': {
			pattern: /(^[\t ]*)#(?:const|else(?:[\t ]+if)?|end[\t ]+if|error|if).*/im,
			lookbehind: true,
			alias: 'property',
			inside: {
				'error-message': {
					pattern: /(^#error).+/,
					lookbehind: true
				},
				'directive': {
					pattern: /^#(?:const|else(?:[\t ]+if)?|end[\t ]+if|error|if)/,
					alias: 'keyword'
				},
				'expression': {
					pattern: /[\s\S]+/,
					inside: 'brightscript'
				}
			}
		},
		'property': {
			pattern: /([\r\n{,][\t ]*)(?:(?!\d)\w+|"(?:[^"\r\n]|"")*"(?!"))(?=[ \t]*:)/,
			lookbehind: true,
			greedy: true
		},
		'string': {
			pattern: /"(?:[^"\r\n]|"")*"(?!")/,
			greedy: true
		},
		'class-name': {
			pattern: /(\bAs[\t ]+)\w+/i,
			lookbehind: true
		},
		'keyword': /\b(?:As|Dim|Each|Else|Elseif|End|Exit|For|Function|Goto|If|In|Print|Return|Step|Stop|Sub|Then|To|While)\b/i,
		'boolean': /\b(?:false|true)\b/i,
		'function': /\b(?!\d)\w+(?=[\t ]*\()/,
		'number': /(?:\b\d+(?:\.\d+)?(?:[ed][+-]\d+)?|&h[a-f\d]+)\b[%&!#]?/i,
		'operator': /--|\+\+|>>=?|<<=?|<>|[-+*/\\<>]=?|[:^=?]|\b(?:and|mod|not|or)\b/i,
		'punctuation': /[.,;()[\]{}]/,
		'constant': /\b(?:LINE_NUM)\b/i
	}
} as LanguageProto<'brightscript'>;
