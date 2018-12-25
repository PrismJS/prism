Prism.languages.hcl = {
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
		inside: {
			'interpolation': {
				pattern: /(^|[^$])\$\{(?:[^{}"]|"(?:[^\\"]|\\[\s\S])*")*\}/,
				lookbehind: true,
				inside: {
					'type': {
						pattern: /((?:terraform|var|self|count|module|path|data|local)\.)[\w\*]+/i,
						lookbehind: true,
						alias: 'variable'
					},
					'keyword': /terraform|var|self|count|module|path|data|local/ig,
					'function': /\w+(?=\()/,
					'string': /"(?:\\[\s\S]|[^\\"])*"/,
					'punctuation': /[!\$#%&'()*+,.\/;<=>@\[\\\]^`{|}~?:]/,
					'number': /-?\d+\.?\d*/,
				}
			},
		}
	},
	'number': /0x[\da-f]+|\d+\.?\d*(?:e[+-]?\d+)?/i,
	'boolean': /\b(?:true|false)\b/i,
	'punctuation': /[=\[\]{}]/,
};
