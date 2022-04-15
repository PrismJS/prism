(function (Prism) {
	var operator = /\.{3}|:[:=]|\|>|->|=(?:==?|>)?|<=?|>=?|[|^?'#!~`]|[+\-*\/]\.?|\b(?:asr|land|lor|lsl|lsr|lxor|mod)\b/;
	var className = /(\b[A-Z]\w*)|(@[a-z.]*)|#[A-Za-z]\w*|#\d/;
	var keyword = /\b(?:and|as|assert|begin|bool|class|constraint|do|done|downto|else|end|exception|external|float|for|fun|function|if|in|include|inherit|initializer|int|lazy|let|method|module|mutable|new|nonrec|object|of|open|or|private|rec|string|switch|then|to|try|type|val|virtual|when|while|with)\b/;

	Prism.languages.rescript = {
		'comment': {
			pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
			greedy: true
		},
		'string': /"(?:\\(?:\r\n|[\s\S])|[^\\\r\n"])*"/,
		'class-name': className,
		'function': /[a-zA-Z]\w*(?=\()|(\.)[a-z]\w*/,
		'number': /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
		'attr-value': /[A-Za-z]\w*(?==)/,
		'constant': {
			pattern: /(\btype\s+)[a-z]\w*/,
			lookbehind: true
		},
		'tag': {
			pattern: /(<)[a-z]\w*|(?:<\/)[a-z]\w*/,
			lookbehind: true,
			inside: {
				'operator': /<|>|\//,
			},
		},
		'keyword': keyword,
		'operator': operator
	};

	Prism.languages.insertBefore('rescript', 'string', {
		'template-string': {
			pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
			greedy: true,
			inside: {
				'template-punctuation': {
					pattern: /^`|`$/,
					alias: 'string'
				},
				'interpolation': {
					pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
					lookbehind: true,
					inside: {
						'interpolation-punctuation': {
							pattern: /^\$\{|\}$/,
							alias: 'punctuation'
						},
						rest: Prism.languages.rescript
					}
				},
				'string': /[\s\S]+/
			}
		},
	});

	Prism.languages.res = Prism.languages.rescript;
}(Prism));
