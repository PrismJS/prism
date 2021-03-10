Prism.languages.nevod = {
	'comment': /(?:\/\/.*)|(?:\/\*[\s\S]*?(?:\*\/|$))/,
	'string': [
		{
			pattern: /"(?:""|[^"])*"(?!")!?\*?/,
			greedy: true,
			inside: {
				'modifiers': /!$|!\*$|\*$/,
			},
		},
		{
			pattern: /'(?:''|[^'])*'(?!')!?\*?/,
			greedy: true,
			inside: {
				'modifiers': /!$|!\*$|\*$/,
			},
		}
	],
	'keyword': /@(?:inside|outside|having|search|where)\b/,
	'require': /@require\b/,
	'namespace': {
		pattern: /@namespace\s+[a-zA-Z0-9\-.]+\s*{/,
		inside: {
			'keyword': /@namespace\b/,
			'name': /\b[a-zA-Z0-9\-.]+/
		},
	},
	'pattern': {
		pattern: /(?:@pattern\s+)?#?[a-zA-Z0-9\-.]+\s*(?:(?:[(]\s*(?:(?:~\s*)?[a-zA-Z0-9\-.]+\s*(?:,\s*(?:(?:~\s*)?[a-zA-Z0-9\-.]*))*)[)])\s*)?=/,
		inside: {
			'keyword': /@pattern\b/,
			'name': {
				pattern: /^(\s+)?#?[a-zA-Z0-9\-.]+/,
				lookbehind: true
			},
			'equal': /=/,
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
		pattern: /(?:@search\s+|#)[a-zA-Z0-9\-.]+(?:\.\*)?\s*(?=;)/,
		inside: {
			'keyword': /@search\b/,
			'name': /#?.*(?=;)/
		}
	},
	'basic-reference': {
		pattern: /\b(?:Word|Punct|Symbol|Space|LineBreak|Start|End|Alpha|AlphaNum|Num|NumAlpha|Blank|WordBreak|Any)(?:\(.*\)|\b)/,
		inside: {
			'name': /.+(?=[(\b])/,
			'params': /\(.*\)/,
		},
	},
	'quantifier': /\b\d+(?:\+|-\d+)?\b/,
	'conjunction': /&/,
	'exception': /~/,
	'optionality': /\?/,
	'bracket': /[()]/,
	'repetition': /[[\]]/,
	'variation': /[{}]/,
	'semi-colon': /;/,
	'attr-capture': {
		pattern: /[a-zA-Z0-9\-.]+\s*:/,
		inside: {
			'attr-name': /[a-zA-Z0-9\-.]+/,
			'colon': /:/,
		},
	},
	'punctuation': /[,+_]|\.{2,3}/,
	'name': /\S+/
}
