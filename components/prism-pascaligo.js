// Pascaligo is a layer 2 smart contract language for the tezos blockchain

Prism.languages.pascaligo = {
	'comment': /\(\*[\s\S]+?\*\)|\/\/.*/,
	'string': {
		pattern: /(["'`])(\\[\s\S]|(?!\1)[^\\])*\1/,
		greedy: true
	},
	'class-name': {
        pattern: /\w+(?=\s+is\b)/i,
    },
	'keyword': {
		pattern: /(^|[^&])\b(?:begin|block|case|const|else|end|for|from|function|if|is|nil|of|remove|return|skip|then|type|var|while|with)\b/i,
		lookbehind: true
	},
	'boolean': {
		pattern: /(^|[^&])\b(?:True|False)\b/i,
		lookbehind: true
	},
    'builtin': {
		pattern: /(^|[^&])\b(?:int|map|nat|record|string|unit)\b/i,
		lookbehind: true
    },
    'function': {
        pattern: /(?!with\b)\b\w+ ?(?=\()/i,
    },
    'variable': 
	{ 
		pattern: /\w+ ?(?=\:)/,
	},
	'number': [
		// Hexadecimal, octal and binary
		/(?:[&%]\d+|\$[a-f\d]+)/i,
		//Natural Numbers
		/([0-9]+)n/,
		// Decimal
		/\b\d+(?:\.\d+)?(?:e[+-]?\d+)?/i
		

	],
	'operator': /\.\.|\*\*|\||->|=\/=|:=|<[<=>]?|>[>=]?|[+\-*\/]=?|[@^=]/,
	'punctuation': /\(\.|\.\)|[()\[\]:;,.{}]/
};
