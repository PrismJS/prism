(function (Prism) {
	Prism.languages.lean = {
		'string': {
			pattern: /"(?:[^\\"]|\\(?:\S|\s+\\))*"/,
			greedy: true
		},
		'number': /\b(?:[-]?\d+(?:\.\d+)?(?:e[+-]?\d+)?|0b[01]+|0o[0-7]+|0x[0-9a-f]+)\b/i,
		'comment': {
			pattern: /--.*\r\n/m
		},
	};
}(Prism));