import type { LanguageProto } from '../types';

export default {
	id: 'tremor',
	alias: ['trickle', 'troy'],
	grammar() {
		const interpolationPattern = /#\{(?:[^"{}]|\{[^{}]*\}|"(?:[^"\\\r\n]|\\(?:\r\n|[\s\S]))*")*\}/.source;

		return {
			'comment': {
				pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
				lookbehind: true
			},
			'interpolated-string': {
				pattern: RegExp(
					/(^|[^\\])/.source +
						'(?:' +
						'"""(?:' + /[^"\\#]|\\[\s\S]|"(?!"")|#(?!\{)/.source + '|' + interpolationPattern + ')*"""' +
						'|' +
						'"(?:' + /[^"\\\r\n#]|\\(?:\r\n|[\s\S])|#(?!\{)/.source + '|' + interpolationPattern + ')*"' +
						')'
				),
				lookbehind: true,
				greedy: true,
				inside: {
					'interpolation': {
						pattern: RegExp(interpolationPattern),
						inside: {
							'punctuation': /^#\{|\}$/,
							'expression': {
								pattern: /[\s\S]+/,
								inside: 'tremor'
							}
						}
					},
					'string': /[\s\S]+/
				}
			},
			'extractor': {
				pattern: /\b[a-z_]\w*\|(?:[^\r\n\\|]|\\(?:\r\n|[\s\S]))*\|/i,
				greedy: true,
				inside: {
					'regex': {
						pattern: /(^re)\|[\s\S]+/,
						lookbehind: true
					},
					'function': /^\w+/,
					'value': /\|[\s\S]+/
				}
			},
			'identifier': {
				pattern: /`[^`]*`/,
				greedy: true
			},

			'function': /\b[a-z_]\w*(?=\s*(?:::\s*<|\())\b/,

			'keyword': /\b(?:args|as|by|case|config|connect|connector|const|copy|create|default|define|deploy|drop|each|emit|end|erase|event|flow|fn|for|from|group|having|insert|into|intrinsic|let|links|match|merge|mod|move|of|operator|patch|pipeline|recur|script|select|set|sliding|state|stream|to|tumbling|update|use|when|where|window|with)\b/,
			'boolean': /\b(?:false|null|true)\b/i,

			'number': /\b(?:0b[01_]*|0x[0-9a-fA-F_]*|\d[\d_]*(?:\.\d[\d_]*)?(?:[Ee][+-]?[\d_]+)?)\b/,

			'pattern-punctuation': {
				pattern: /%(?=[({[])/,
				alias: 'punctuation'
			},
			'operator': /[-+*\/%~!^]=?|=[=>]?|&[&=]?|\|[|=]?|<<?=?|>>?>?=?|(?:absent|and|not|or|present|xor)\b/,
			'punctuation': /::|[;\[\]()\{\},.:]/,
		};
	}
} as LanguageProto<'tremor'>;
