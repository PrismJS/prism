// https://gn.googlesource.com/gn/+/refs/heads/main/docs/reference.md#grammar

Prism.languages.gn = {
	'comment': {
		pattern: /#.*/,
		greedy: true
	},
	'string-literal': {
		pattern: /(^|[^\\"])"(?:[^\r\n"\\]|\\.)*"/,
		lookbehind: true,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /((?:^|[^\\])(?:\\{2})*)\$(?:\{[\s\S]*?\}|[a-zA-Z_]\w*|0x[a-fA-F0-9]{2})/,
				lookbehind: true,
				inside: {
					'number': /^\$0x[\s\S]{2}$/,
					'variable': /^\$\w+$/,
					'interpolation-punctuation': {
						pattern: /^\$\{|\}$/,
						alias: 'punctuation'
					},
					'expression': {
						pattern: /[\s\S]+/,
						inside: null // see below
					}
				}
			},
			'string': /[\s\S]+/
		}
	},

	'keyword': /\b(?:else|if)\b/,
	'boolean': /\b(?:true|false)\b/,
	'builtin-function': {
		// a few functions get special highlighting to improve readability
		pattern: /\b(?:assert|defined|foreach|import|pool|print|template|tool|toolchain)(?=\s*\()/i,
		alias: 'keyword'
	},
	'function': /\b[a-z_]\w*(?=\s*\()/i,

	'number': /-?\b\d+\b/,

	'operator': /[-+!=<>]=?|&&|\|\|/,
	'punctuation': /[(){}[\],.]/
};

Prism.languages.gn['string-literal'].inside['interpolation'].inside['expression'].inside = Prism.languages.gn;

Prism.languages.gni = Prism.languages.gn;
