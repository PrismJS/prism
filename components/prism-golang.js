Prism.languages.golang = Prism.languages.extend('clike', {
	'keyword': /\b(break|default|func|interface|select|case|defer|go|map|struct|chan|else|goto|package|switch|const|fallthrough|if|range|type|continue|for|import|return|var|bool|byte|complex64|complex128|error|float32|float64|int|int8|int16|int32|int64|rune|string|uint|uint8|uint16|uint32|uint64|uintptr|append|cap|close|complex|copy|delete|imag|len|make|new|panic|print|println|real|recover)\b/g,
	'number': /-?(0x[a-f\d]+|(\d+\.?\d*|\.\d+)(e[-+]?\d+)?)i?/ig,
	'operator': /(&lt;|>){2}=?|[-+\|]{2}|(&amp;){2}|(&amp;)\^=?|&lt;-|:=|[-+\|*^/=%!]=?|(&amp;|&lt;|>)=?|\.{3}/g,
	'boolean': /\b(true|false|iota|nil)\b/g,
	'string': /("|'|`)(\\?.|\r|\n)*?\1/g,
	'class-name': false,
});