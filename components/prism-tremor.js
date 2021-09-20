// NOTE: Tremor supports recursive nested interpolation in strings
// but we do support intperpolation in this definition as nested
// recursive interpolation isn't yet fully supported by prism.

Prism.languages.tremor = {
	'comment': {
		pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
		lookbehind: true
	},
   	'heredoc': {
        pattern: /"""(?:[^"]|("[^"])|(""[^"]))+"""/,
        greedy: true,
        alias: "string"
	},
   	'string': {
        pattern: /(^|[^\\])"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
        lookbehind: true
        greedy: true,
        alias: "string"
	},
	'function':  /\b[a-z_]\w*(?=\s*(?:::\s*<|\())\b/,
	'keyword': /\b(?:event|state|select|create|define|deploy|operator|script|connector|pipeline|flow|config|links|connect|to|from|into|with|group|by|args|window|stream|tumbling|sliding|where|having|set|each|emit|drop|const|let|for|match|of|case|when|default|end|patch|insert|update|erase|move|copy|merge|fn|intrinsic|recur|use|as|mod)\b/,
	'boolean': /\b(?:true|false|null)\b/i,
    'variable': {
        pattern: /`[^`]*`|\b[_a-z]\w*\b/,
        greedy: true
    },
	'number': /\b(0b[0-1_]*)|(0x[0-9a-fA-F_]*)|(([0-9][0-9_]*)(\.[0-9][0-9_]*)?((e|E)(\+|-)?[0-9_]+)?)\b/,
    'operator': /\b[-+*\/%!^]=?|=[=>]?|&[&=]?|\|[|=]?|<<?=?|>>?=?|\b(?:not|and|or|xor|present|absent)\b/,
	'punctuation': /[;\[\]()\{\},.]/,
    'namespace': {
			pattern: /(?:\b[a-z][a-z_\d]*\s*::\s*)*\b[a-z][a-z_\d]*\s*::(?!\s*<)/,
			inside: {
				'punctuation': /::/
			}
		},
};

Prism.languages.troy = Prism.languages['tremor'];
Prism.languages.trickle = Prism.languages['tremor'];
