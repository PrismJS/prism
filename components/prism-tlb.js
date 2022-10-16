Prism.languages.tlb = {
	'builtin': /\b(?:Bool|Both|Cell|Either|Maybe|Type|Unit|bits256|bits512|int16|int32|int64|int8|uint15|uint16|uint32|uint63|uint64|uint8)\b/,
	'keyword': /\b(?:BoolFalse|BoolTrue|False|Null|True)\b/,

	'comment': {
		pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
		greedy: true
	},
	'comment-multiline': [
		{
			pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
			lookbehind: true,
			greedy: true,
			alias: 'comment'
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true,
			greedy: true,
			alias: 'comment'
		}
	],

	'symbol': [
		/#[0-9a-f]*_?/,
		/\$[01]*_?/,
		/\b(?:##|#<|#<=)\b/,
	],
	'variable': /[a-zA-Z_]\w*/,
	'operator': [
		/\+/, /-/, /\*/, /\//,
		/!=/, /==/, /=/,
		/\?/, /~/, /\./, /\^/,
		/<=/, />=/, /</, />/,
	],
	'number': /\d+/,
	'punctuation': /[;\(\):\[\]\{\}]/,
};
