/** @type {import('../types.d.ts').LanguageProto<'rgc'>} */
export default {
	id: 'rgc',
	alias: 'rg',
	grammar: {
		'comment': {
			pattern: /(^|[^\\])#.*/,
			lookbehind: true,
			greedy: true,
		},
		'block-comment': {
			pattern: /\/\*[\s\S]*?\*\//,
			greedy: true,
			alias: 'comment',
		},
		'string': {
			pattern: /"(?:\\.|[^"\\\r\n])*"/,
			greedy: true,
		},
		'number': {
			pattern: /\b(?:0[xX][\da-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d[\d_]*)?)\b/,
		},
		'boolean': {
			pattern: /\b(?:False|None|True)\b/,
		},
		'class-name': {
			pattern: /(\b(?:class|enum|interface)\s+)[A-Za-z_]\w*/,
			lookbehind: true,
		},
		'decorator': {
			pattern: /(^|\s)@(?:var\b|[A-Za-z_]\w*)/,
			lookbehind: true,
		},
		'keyword': {
			pattern: /\b(?:and|break|case|class|continue|def|elif|else|enum|for|if|import|in|interface|match|not|or|pass|return|var|while)\b/,
		},
		'builtin': {
			pattern: /\b(?:bool|float|int|str)\b/,
		},
		'function': {
			pattern: /\b[A-Za-z_]\w*(?=\s*\()/,
		},
		'operator': {
			pattern: /->|=>|<<|>>|\*\*|\/\/|[-+*/%&|^~!<>=]=?/,
		},
		'punctuation': {
			pattern: /[()\[\]{}.,:;]/,
		},
	},
}