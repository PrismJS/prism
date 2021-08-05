// based loosely upon: https://github.com/Azure/bicep/blob/main/src/textmate/bicep.tmlanguage
Prism.languages.bicep = {
	'comment': [
		{
			// multiline comments eg /* ASDF */
			pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
			lookbehind: true,
			greedy: true
		},
		{
			// singleline comments eg // ASDF
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true,
			greedy: true
		}
	],

	'property': [
		{
			pattern: /([\r\n][ \t]*)[a-z_]\w*(?=[ \t]*:)/i,
			lookbehind: true
		},
		{
			pattern: /([\r\n][ \t]*)'(?:\\.|\$(?!\{)|[^'\\\r\n$])*'(?=[ \t]*:)/i,
			lookbehind: true,
			greedy: true
		}
	],
	'string': [
		{
			pattern: /'''[^'][\s\S]*?'''/,
			greedy: true
		},
		{
			pattern: /(^|[^\\'])'(?:\\.|\$(?!\{)|[^'\\\r\n$])*'/,
			lookbehind: true,
			greedy: true,
		}
	],
	'interpolated-string': {
		pattern: /(^|[^\\'])'(?:\\.|\$(?:(?!\{)|\{[^{}\r\n]*\})|[^'\\\r\n$])*'/,
		lookbehind: true,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\$\{[^{}\r\n]*\}/,
				inside: {
					'expression': {
						pattern: /(^\$\{)[\s\S]+(?=\}$)/,
						lookbehind: true
					},
					'punctuation': /^\$\{|\}$/,
				}
			},
			'string': /[\s\S]+/
		}
	},

	'class-name': {
		pattern: /(\b(?:output|param)\b[ \t]+\w+[ \t]+)\w+\b/,
		lookbehind: true
	},

	'boolean': /\b(?:true|false)\b/,
	// https://github.com/Azure/bicep/blob/114a3251b4e6e30082a58729f19a8cc4e374ffa6/src/textmate/bicep.tmlanguage#L184
	'keyword': /\b(?:targetScope|resource|module|param|var|output|for|in|if|existing|null)\b/,

	'decorator': /@\w+\b/,
	// https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/template-functions-array
	'function': [
		/\b[a-z_]\w*(?=[ \t]*\()/i,
		/\b(?:array|concat|contains|createArray|empty|first|intersection|last|length|max|min|range|skip|take|union)(?:\$|\b)/
	],

	'number': /(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:E[+-]?\d+)?/i,
	'operator': /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
	'punctuation': /[{}[\];(),.:]/,
};

Prism.languages.bicep['interpolated-string'].inside['interpolation'].inside['expression'].inside = Prism.languages.bicep;
