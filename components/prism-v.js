Prism.languages.v = Prism.languages.extend('clike', {
	'string': [
		{
			pattern: /`(?:\\[\s\S]|[^\\`])*`/,
			alias: 'backtick-quoted-string',
			greedy: true
		},
		{
			pattern: /r?(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
			alias: 'quoted-string',
			greedy: true,
			inside: {
				'interpolation': {
					pattern: /(?:^|[^\\])(?:\\{2})*\$(?:\{[^{}]*\}|\w+(\.\w+(?:\([^\(\)]*\))?|\[[^\[\]]+\])*)/,
					lookbehind: true,
					inside: {
						'interpolation-variable': {
							pattern: /^\$\w+(\.\w+(?:\([^\(\)]*\))?|\[[^\[\]]+\])*$/,
							alias: 'variable'
						},
						'interpolation-punctuation': {
							pattern: /^\${|}$/,
							alias: 'punctuation'
						},
						rest: Prism.languages.v
					}
				}
			}
		}
	],
	'class-name': {
		pattern: /\b(enum|interface|struct|type)\s+[\w.\\]+/,
		lookbehind: true
	},
	'keyword': /\b(?:as|asm|assert|atomic|break|const|continue|defer|else|embed|enum|fn|for|__global|go(?:to)?|if|import|in|interface|is|lock|match|module|mut|none|or|pub|return|rlock|select|shared|sizeof|static|struct|type(?:of)?|union|unsafe)\b/,
	'number': /\b(?:0x[a-f\d]+(_[a-f\d]+)*|0b[01]+(_[01]+)*|0o[0-7]+(_[0-7]+)*|\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?)\b/i,
	'operator': /~|[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
	'builtin': /\b(?:any(_int|_float)?|bool|byte(ptr)?|charptr|i(8|16|nt|64|128)|rune|size_t|u?string|u(16|32|64|128))\b/
});

Prism.languages.insertBefore('v', 'function', {
	'generic-function': {
		// e.g. foo<T>( ...
		pattern: /\w+\s*<[^<>]*>(?=\()/,
		greedy: true,
		inside: {
			'function': /^\w+/,
			'generic': {
				pattern: /<[\s\S]+/, // everything after the first <
				alias: 'class-name'
			}
		}
	}
});