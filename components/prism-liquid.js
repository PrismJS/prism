Prism.languages.liquid = {
	'keyword': /\b(?:assign|break|capture|case|comment|continue|else|elsif|endcapture|endcase|endcomment|endfor|endif|endraw|endtablerow|endunless|for|if|in|limit|offset|range|raw|reversed|tablerow|unless|when)\b/,
	'number': /\b0b[01]+\b|\b0x(?:\.[\da-fp-]+|[\da-f]+(?:\.[\da-fp-]+)?)\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?[df]?/i,
	'operator': {
		pattern: /(^|[^.])(?:\+[+=]?|-[-=]?|!=?|<<?=?|>>?>?=?|==?|&[&=]?|\|[|=]?|\*=?|\/=?|%=?|\^=?|[?:~])/m,
		lookbehind: true
	},
	'function': {
		pattern: /(^|[\s;|&])(?:abs|append|at_least|at_most|capitalize|ceil|cols|compact|concat|cycle|date|decrement|default|divided_by|downcase|escape|escape_once|first|floor|include|increment|join|last|lstrip|map|minus|modulo|newline_to_br|paginate|plus|prepend|remove|remove_first|replace|replace_first|reverse|round|rstrip|size|slice|sort|sort_natural|split|strip|strip_html|strip_newlines|times|truncate|truncatewords|uniq|upcase|url_decode|url_encode)(?=$|[\s;|&])/,
		lookbehind: true
	}
};
