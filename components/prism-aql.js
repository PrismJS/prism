Prism.languages.aql = {
	'comment': /\/\/.*|\/\*[\s\S]*?\*\//,
	'property': {
		pattern: /([{,]\s*)(?:(?!\d)\w+|(["'´`])(?:(?!\2)[^\\\r\n]|\\.)*\2)(?=\s*:)/,
		lookbehind: true,
		greedy: true
	},
	'string': {
		pattern: /(["'´`])(?:(?!\1)[^\\\r\n]|\\.)*\1/,
		greedy: true
	},
	'variable': /@@?\w+/,
	'keyword': /\b(?:AGGREGATE|ALL|AND|ANY|ASC|COLLECT|DESC|DISTINCT|FILTER|FOR|GRAPH|IN|INBOUND|INSERT|INTO|LET|LIKE|LIMIT|NONE|NOT|NULL|OR|OUTBOUND|REMOVE|REPLACE|RETURN|SHORTEST_PATH|SORT|UPDATE|UPSERT|WITH)\b/i,
	'function': /(?!\d)\w+(?=\s*\()/,
	'boolean': /(?:true|false)/i,
	'range': {
		pattern: /\.\./,
		alias: 'operator'
	},
	'number': /(?:\B\.\d+|\b\d+(?:\.\d+)?)(?:e[+-]?\d+)?/i,
	'operator': /\*\*|[=!]~|[!=<>]=?|&&|\|\||[-+*/%]/,
	'punctuation': /::|[?.:,;()[\]{}]/
};
