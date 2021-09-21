(function (Prism) {

	Prism.languages.tremor = {
		'comment': {
			pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
			lookbehind: true
		},
		'interpolated-string': null, // see below
		'extractor': {
			pattern: /\b[a-z_]\w*\|(?:[^\r\n\\|]|\\(?:\r\n|[\s\S]))*\|/i,
			greedy: true,
			inside: {
				'function': /^\w+/,
				'regex': /\|[\s\S]+/,
			}
		},
		'identifier': {
			pattern: /`[^`]*`/,
			greedy: true
		},

		'function': /\b[a-z_]\w*(?=\s*(?:::\s*<|\())\b/,

		'keyword': /\b(?:event|state|select|create|define|deploy|operator|script|connector|pipeline|flow|config|links|connect|to|from|into|with|group|by|args|window|stream|tumbling|sliding|where|having|set|each|emit|drop|const|let|for|match|of|case|when|default|end|patch|insert|update|erase|move|copy|merge|fn|intrinsic|recur|use|as|mod)\b/,
		'boolean': /\b(?:true|false|null)\b/i,

		'number': /\b(?:0b[0-1_]*|0x[0-9a-fA-F_]*|\d[0-9_]*(?:\.\d[0-9_]*)?(?:[Ee][+-]?[0-9_]+)?)\b/,

		'pattern-punctuation': {
			pattern: /%(?=[({[])/,
			alias: 'punctuation'
		},
		'operator': /[-+*\/%~!^]=?|=[=>]?|&[&=]?|\|[|=]?|<<?=?|>>?>?=?|(?:not|and|or|xor|present|absent)\b/,
		'punctuation': /::|[;\[\]()\{\},.:]/,
	};

	var interpolationPattern = /#\{(?:[^"{}]|\{[^{}]*\}|"(?:[^"\\\r\n]|\\(?:\r\n|[\s\S]))*")*\}/.source;

	Prism.languages.tremor['interpolated-string'] = {
		pattern: RegExp(
			/(^|[^\\])/.source +
			'(?:' +
			'"""(?:' + /[^"\\#]|\\[\s\S]|"(?!"")|#(?!\{)/.source + '|' + interpolationPattern + ')*"""' +
			'|' +
			'"(?:' + /[^"\\\r\n#]|\\(?:\r\n|[\s\S])|#(?!\{)/.source + '|' + interpolationPattern + ')*"' +
			')'
		),
		lookbehind: true,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: RegExp(interpolationPattern),
				inside: {
					'punctuation': /^#\{|\}$/,
					'expression': {
						pattern: /[\s\S]+/,
						inside: Prism.languages.tremor
					}
				}
			},
			'string': /[\s\S]+/
		}
	};

	Prism.languages.troy = Prism.languages['tremor'];
	Prism.languages.trickle = Prism.languages['tremor'];

}(Prism));
