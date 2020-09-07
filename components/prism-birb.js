Prism.languages.birb = Prism.languages.extend('clike', {
	'class-name': [
		/\b[A-Z](?:\w*[a-zA-Z]\w*)?\b/,
    	/\b[A-Z]\w*(?=\s+\w+\s*[;,=())])/
    ],
	'keyword': /\b(?:assert|bool|break|case|class|const|default|double|else|enum|final|follows|for|grab|if|int|nest|next|new|noSeeb|return|static|switch|throw|var|void|while)\b/,
	'variable': /[a-z_]\w*/,
	'function': [
    	Prism.languages.clike.function,
    	{
    		pattern: /[a-z_]\w*\(\)/,
    		greedy: true
    	}
    ],
	'operator': /\+\+|--|&&|\|\||<<=?|>>=?|~(?:\/=?)?|[+\-*\/%&^|=!<>]=?|\?/,
});

Prism.languages.insertBefore('birb','function',{
	'metadata': {
		pattern: /<\w+>/,
		greedy: true,
		alias: 'symbol'
	}
});

