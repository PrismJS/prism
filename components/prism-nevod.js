Prism.languages.nevod = {
	'comment': /(?:\/\/.*)|(?:\/\*[\s\S]*?(?:\*\/|$))/,
	'string': {
		pattern: /("|')[\s\S]*?\1!?\*?/,
		greedy: true,
		inside: {
			modifiers: /!?\*?$/,
		},
	},
	'keyword': /@(require|inside|outside|having|search|pattern|where)\b/,
	'namespace': {
		pattern: /@namespace(\s+[a-zA-Z0-9\-.]*)?\s*{/,
		inside: {
			keyword: /@namespace\b/,
			name: /\s+[a-zA-Z0-9\-.]*/,
			colon: /:$/,
		},
	},
	'pattern': {
		pattern: /(?:#?[a-zA-Z0-9\-.]+)\s*(?:[({]\s*(?:(?:~\s*)?[a-zA-Z0-9\-.]*\s*(?:,\s*(?:(?:~\s*)?[a-zA-Z0-9\-.]*))*)[)}])?\s*=/,
		inside: {
			name: /^#?[a-zA-Z0-9\-.]+/,
			equal: /=/,
			attributes: {
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
	'search': /#[a-zA-Z0-9\-.]+(\.\*)?\s*(?=;)/,
	'basic-reference': {
		pattern: /\b(Word|Punct|Symbol|Space|LineBreak|Start|End|Alpha|AlphaNum|Num|NumAlpha|Blank|WordBreak|Any)(\(.*\)|\b)/,
		inside: {
			name: /Word|Punct|Symbol|Space|LineBreak|Start|End/,
			params: /\(.*\)/,
		},
	},
	'quantifier': /\b\d+(\+|-\d+)?\b/,
	'conjunction': /&/,
	'exception': /~/,
	'optionality': /\?/,
	'bracket': /[()]/,
	'square-bracket': /[[\]]/,
	'curly-bracket': /[{}]/,
	'semi-colon': /;/,
	'attr-capture': {
		pattern: /[a-zA-Z0-9\-.]+\s*:/,
		inside: {
			'attr-name': /[a-zA-Z0-9\-.]+/,
			colon: /:/,
		},
	},
	'punctuation': /[,+_]|\.{2,3}/,
	'pattern-reference': /\S+/
}
