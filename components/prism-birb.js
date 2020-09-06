Prism.languages.birb = Prism.languages.extend('clike', {
	'string': [
		{
			pattern: /r?("""|''')[\s\S]*?\1/,
			greedy: true
		},
		{
			pattern: /r?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
			greedy: true
		}
	],
	'keyword': /\b(?:assert|break|case|class|const|default|else|enum|final|follows|for|grab|if|nest|next|new|NoSeeb|return|static|switch|throw|var|void|while)\b/,
	'operator': /\+\+|--|&&|\|\||<<=?|>>=?|~(?:\/=?)?|[+\-*\/%&^|=!<>]=?|\?/
});

Prism.languages.insertBefore('birb','function',{
	'metadata': {
		pattern: /@\w+/,
		alias: 'symbol'
	}
});

