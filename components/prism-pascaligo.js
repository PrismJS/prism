// Pascaligo is a layer 2 smart contract language for the tezos blockchain

Prism.languages.pascaligo = {
	'comment': /\(\*[\s\S]+?\*\)|\/\/.*/,
	'string': [
		{
			pattern: /(?:'(?:''|[^'\r\n])*')+|\^[a-z]/i,
			greedy: true
		},
		{
			pattern: /(?:"(?:""|[^"\r\n])*")+|\^[a-z]/i,
			greedy: true
		},
	],
	'keyword': {
		pattern: /(^|[^&])\b(?:begin|block|const|else|end|for|from|function|if|is|nil|remove|return|skip|then|type|var|while|with)\b/i,
		lookbehind: true
	},
	'boolean': {
		pattern: /(^|[^&])\b(?:True|False)\b/i,
		lookbehind: true
	},
    'builtin': {
        pattern: /(^|[^&])\b(?:int|unit|string|nat|map)\b/i,
		lookbehind: true
    },
    'function': {
        pattern: /(?!with\b)\b\w+ ?(?=\()/i,
    },
    'variable': 
	{ 
		pattern: /\w+ ?(?=\:)/,
	},
    'class-name': {
        pattern: /\w+(?=\s+is\b)/i,
    },
	'number': [
		// Hexadecimal, octal and binary
		/(?:[&%]\d+|\$[a-f\d]+)/i,
		// Decimal
		/\b\d+(?:\.\d+)?(?:e[+-]?\d+)?/i
	],
	'operator': /\.\.|\*\*|:=|<[<=>]?|>[>=]?|[+\-*\/]=?|[@^=]/,
	'punctuation': /\(\.|\.\)|[()\[\]:;,.]/
};
