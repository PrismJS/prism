Prism.languages.nevod = {
	'comment': /\/\/.*|(?:\/\*[\s\S]*?(?:\*\/|$))/,
	'string': {
		pattern: /(?:"(?:""|[^"])*"(?!")|'(?:''|[^'])*'(?!'))!?\*?/,
		greedy: true,
		inside: {
			'modifiers': /!$|!\*$|\*$/,
		},
	},
	'namespace': {
		pattern: /(@namespace\s+)[a-zA-Z0-9\-.]+(?=\s*{)/,
		lookbehind: true,
	},
	'pattern': {
		pattern: /(@pattern\s+)?#?[a-zA-Z0-9\-.]+\s*(?:(?:[(]\s*(?:(?:~\s*)?[a-zA-Z0-9\-.]+\s*(?:,\s*(?:(?:~\s*)?[a-zA-Z0-9\-.]*))*)[)])\s*)?(?:=)/,
		alias: 'class-name',
		lookbehind: true,
		inside: {
			'name': /#?[a-zA-Z0-9\-.]+/,
			'attributes': {
				pattern: /\(.*\)/,
				inside: {
					'attr-name': /[a-zA-Z0-9\-.]+/,
					'attr-hidden-mark': /~/,
					'attr-punctuation': /[,]/,
					'attr-bracket': /[()]/,
				},
			},
		},
	},
	'search': {
		pattern: /(@search\s+|#)[a-zA-Z0-9\-.]+\s*(?:\.\*\s*)?(?:;)/,
		alias: 'function',
		lookbehind: true,
	},
	'keyword': /@(?:require|namespace|pattern|search|inside|outside|having|where)\b/,
	'builtin': {
		pattern: /\b(?:Word|Punct|Symbol|Space|LineBreak|Start|End|Alpha|AlphaNum|Num|NumAlpha|Blank|WordBreak|Any)(?:\(.*\)|\b)/,
		inside: {
			'name': /.+\b/,
			'params': /\(.*\)/,
		},
	},
	'quantifier': {
		pattern: /\b\d+(?:\+|-\d+)?\b/,
		alias: 'number',
	},
	'operator': [
		{
			pattern: /&/,
			alias: 'conjunction',
		},
		{
			pattern: /~/,
			alias: 'exception',
		},
		{
			pattern: /\?/,
			alias: 'optionality',
		},
		{
			pattern: /[[\]]/,
			alias: 'repetition',
		},
		{
			pattern: /[{}]/,
			alias: 'variation',
		},
		{
			pattern: /[+_]/,
			alias: 'sequence',
		},
		{
			pattern: /\.{2,3}/,
			alias: 'span',
		},
	],
	'attr-capture': {
		pattern: /[a-zA-Z0-9\-.]+\s*:/,
		inside: {
			'attr-name': /[a-zA-Z0-9\-.]+/,
			'colon': /:/,
		},
	},
	'punctuation': /[:;,()=]/,
	'name': /\S+/
}
