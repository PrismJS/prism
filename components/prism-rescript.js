(function (Prism) {
	var operator = /\.{3}|:[:=]|\|>|->|=(?:==?|>)?|<=?|>=?|[|^?'#!~`]|[+\-*\/]\.?|\b(?:asr|land|lor|lsl|lsr|lxor|mod)\b/;
	var className = /(\b[A-Z]\w*)|(@[a-z.]*)|#[A-Za-z]\w*|#\d/;
	var number = /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i;
	var keyword = /\b(?:and|as|assert|begin|bool|class|constraint|do|done|downto|else|end|exception|external|float|for|fun|function|if|in|include|inherit|initializer|int|lazy|let|method|module|mutable|new|nonrec|object|of|open|or|private|rec|string|switch|then|to|try|type|val|virtual|when|while|with)\b/;

	Prism.languages.rescript = {
		'comment': {
			pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
			greedy: true
		},
		'string': {
			pattern: /("(?:\\(?:\r\n|[\s\S])|[^\\\r\n"])*")|(`(?:\\(?:\r\n|[\s\S])|[^\\\r\n"])*`)/,
			greedy: true,
			inside: {
				'tag': {
					pattern: /\$\{.*\}/,
					inside: {
						'class-name': /[A-Z]\w*/g,
						'function': /[a-z]\w*/g,
						'punctuation': /\./g,
						'operator': operator,
						'number': number,
						'keyword': keyword
					}
				},
			}
		},

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
}(Prism));
