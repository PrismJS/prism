Prism.languages.idris = Prism.languages.extend('haskell', {
	'comment': {
		pattern: /(?:(?:--|\|\|\|).*$|\{-[\s\S]*?-\})/m,
	},
	'keyword': /\b(?:Type|case|class|codata|constructor|corecord|data|do|dsl|else|export|if|implementation|implicit|import|impossible|in|infix|infixl|infixr|instance|interface|let|module|mutual|namespace|of|parameters|partial|postulate|private|proof|public|quoteGoal|record|rewrite|syntax|then|total|using|where|with)\b/,
	'import-statement': {
		pattern: /(^\s*)import\s+(?:[A-Z][\w']*)(?:\.[A-Z][\w']*)*/m,
		lookbehind: true
	},
	'builtin': undefined
});

Prism.languages.idr = Prism.languages.idris;
