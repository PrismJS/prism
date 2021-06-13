Prism.languages.liquid = {
	'delimiter': {
		pattern: /^\{(?:\{\{|[%\{])-?|-?(?:\}\}|[%\}])\}$/,
		alias: 'punctuation'
	},
	'string': {
		pattern: /"[^"]*"|'[^']*'/,
		greedy: true
	},
	'keyword': /\b(?:as|assign|break|capture|case|comment|contains|continue|decrement|echo|else|elsif|endcapture|endcase|endcomment|endfor|endif|endraw|endtablerow|endunless|for|if|in|include|increment|limit|liquid|offset|range|raw|render|reversed|tablerow|unless|when|with)\b/,
	'function': {
		pattern: /(^|[\s;|&])(?:append|prepend|capitalize|cycle|cols|increment|decrement|abs|at_least|at_most|ceil|compact|concat|date|default|divided_by|downcase|escape|escape_once|first|floor|join|last|lstrip|map|minus|modulo|newline_to_br|plus|remove|remove_first|replace|replace_first|reverse|round|rstrip|size|slice|sort|sort_natural|split|strip|strip_html|strip_newlines|times|truncate|truncatewords|uniq|upcase|url_decode|url_encode|include|paginate)(?=$|[\s;:|&])/,
		lookbehind: true
	},
	'boolean': /\b(?:true|false)\b/,
	'range': {
		pattern: /\.\./,
		alias: 'operator'
	},
	'number': /\b0b[01]+\b|\b0x(?:\.[\da-fp-]+|[\da-f]+(?:\.[\da-fp-]+)?)\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?[df]?/i,
	'operator': {
		pattern: /(^|[^.])(?:\+[+=]?|-[-=]?|!=?|<<?=?|>>?>?=?|==?|&[&=]?|\|[|=]?|\*=?|\/=?|%=?|\^=?|[?:~])|\b(?:and|or)\b/m,
		lookbehind: true
	},
	'punctuation': /[.,\[\]()]/
};

Prism.hooks.add('before-tokenize', function (env) {
	var liquidPattern = /\{(?:%[\s\S]*?%|\{\{[\s\S]*?\}\}|\{[\s\S]*?\})\}/g;
	Prism.languages['markup-templating'].buildPlaceholders(env, 'liquid', liquidPattern);
});

Prism.hooks.add('after-tokenize', function (env) {
	Prism.languages['markup-templating'].tokenizePlaceholders(env, 'liquid');
});
