// based loosely upon: https://github.com/Azure/bicep/blob/main/src/textmate/bicep.tmlanguage
// npm run test:languages -- --language=bicep --update
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
	'string': {
		// this doesn't handle string interpolalation or multiline strings as yet
		pattern: /(?:'(?:''|[^'\r\n])*'(?!')|#[&$%]?[a-f\d]+)+|\^[a-z]/i,
		greedy: true
	},
	'number': /(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:E[+-]?\d+)?/i,
	'boolean': /\b(?:true|false)\b/,
	'keyword': /\b(targetScope|resource|module|param|var|output|for|in|if|existing)\b/i, // https://github.com/Azure/bicep/blob/114a3251b4e6e30082a58729f19a8cc4e374ffa6/src/textmate/bicep.tmlanguage#L184
	'function': /\b(?:array|concat|contains|createArray|empty|first|intersection|last|length|max|min|range|skip|take|union)(?:\$|\b)/i, // https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/template-functions-array
	'operator': /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
	'punctuation': /[{}[\];(),.:]/,
	'decorator': /@\w*\b/
};
