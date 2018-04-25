Prism.languages.solidity = Prism.languages.extend('clike', {
    'keyword': [
		{pattern: /\b(?:var|import|function|constant|view|pure|payable|storage|memory|if|else|for|while|do|break|continue|returns?|private|public|internal|external|inherited|this|suicide|selfdestruct|emit|new|is|throw|revert|assert|require|\_)\b/},
        {
            pattern: /\b(contract|interface|library|using|struct|function|modifier)\s+([A-Za-z_]\w*)(?:\s+is\s+((?:[A-Za-z_][\,\s]*)*))?\b/,
            inside: {
                'variable': {
                    pattern: /\b(contract|interface|library|using|struct|function|modifier)\s+([A-Za-z_]\w*)(?:\s+is\s+((?:[A-Za-z_][\,\s]*)*))?\b/,
                    lookbehind: true,
                }
            }
		},
    ],
	'number': /\b(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\()/i,
	'operator': /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/,
	'constant': [
		{
			pattern: /\b(address|string|bytes\d*|int\d*|uint\d*|bool|u?fixed\d+x\d+)\b(?:\s+(?:indexed\s+)?([A-Za-z_]\w*)\s*[,\)])?/,
			inside: {
				'attr-name' : {
					pattern: /\b(address|string|bytes\d*|int\d*|uint\d*|bool|u?fixed\d+x\d+)\b(?:\s+(?:indexed\s+)?([A-Za-z_]\w*)\s*[,\)])?/,
					lookbehind: true,
					inside: {
						punctuation: {
							pattern: /[(){};:]/,
							lookbehind: true,
						}
					}
				}
			}
		},
		{
			pattern: /\b(mapping)\s*\((.*)\s+=>\s+(.*)\)(\s+(?:private|public|internal|external|inherited))?\s+([A-Za-z_]\w*)\b/,
			inside: {
				keyword: {
					pattern: /(\s+(?:private|public|internal|external|inherited))/
				}
			}
		}
	]
});

Prism.languages.insertBefore('solidity', 'keyword', {
	'regex': {
		pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[[^\]\r\n]+]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,
		lookbehind: true,
		greedy: true
	},
	// This must be declared before keyword because we use "function" inside the look-forward
	'function-variable': {
		pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i,
		alias: 'function'
	},
	'constant': /\b[A-Z][A-Z\d_]*\b/
});

Prism.languages.insertBefore('solidity', 'string', {
	'template-string': {
		pattern: /`(?:\\[\s\S]|[^\\`])*`/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\$\{[^}]+\}/,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\$\{|\}$/,
						alias: 'punctuation'
					},
					rest: Prism.languages.solidity
				}
			},
			'string': /[\s\S]+/
		}
	}
});
