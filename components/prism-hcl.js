Prism.languages.hcl = {
	'heredoc': {
		pattern: /<<-?(\w+)[\s\S]*?^\s*\1/m,
		alias: 'string'
	},
	'comment': /(?:\/\/|#).*|\/\*[\s\S]*?(?:\*\/|$)/,
	'keyword': [
		{
			pattern: /(?:resource|data)\s+(?:[\w-]+|"[\w-]+")(?=\s+"[\w-]+"\s+{)/i,
			inside: {
				'type': {
					pattern: /(resource|data|\s+)(?:[\w-]+|"[\w-]+")/i,
					lookbehind: true,
					alias: 'variable'
				}
			}
		},
		{
			pattern: /(?:provider|provisioner|variable|output|module|backend)\s+"?[\w-]+"?\s+(?={)/i,
			inside: {
				'type': {
					pattern: /(provider|provisioner|variable|output|module|backend)\s+"?[\w-]+"?\s+/i,
					lookbehind: true,
					alias: 'variable'
				}
			}
		},
		{
			pattern: /[\w-]+(?=\s+{)/
		}
	],
	'property': [
		/[\w-\.]+(?=\s*=(?!=))/,
		/"(?:\\[\s\S]|[^\\"])+"(?=\s*[:=])/,
	],
	'string': {
		pattern: /"(?:[^\\$"]|\\[\s\S]|\$(?:(?=")|\$+|[^"${])|\$\{(?:[^{}"]|"(?:[^\\"]|\\[\s\S])*")*\})*"/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /(^|[^$])\$\{(?:[^{}"]|"(?:[^\\"]|\\[\s\S])*")*\}/,
				lookbehind: true,
				inside: {
					'type': {
						pattern: /(\b(?:terraform|var|self|count|module|path|data|local)\b\.)[\w\*]+/i,
						lookbehind: true,
						alias: 'variable'
					},
					'keyword': /\b(?:terraform|var|self|count|module|path|data|local)\b/i,
					'function': /\w+(?=\()/,
					'string': {
						pattern: /"(?:\\[\s\S]|[^\\"])*"/,
						greedy: true,
					},
					'number': /0x[\da-f]+|\d+\.?\d*(?:e[+-]?\d+)?/i,
					'punctuation': /[!\$#%&'()*+,.\/;<=>@\[\\\]^`{|}~?:]/,
				}
			},
		}
	},
	'number': /0x[\da-f]+|\d+\.?\d*(?:e[+-]?\d+)?/i,
	'boolean': /\b(?:true|false)\b/i,
	'punctuation': /[=\[\]{}]/,
};
