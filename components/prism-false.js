(function (Prism) {
	/**
	 * Implements.
	 *
	 * @see {@link https://github.com/PrismJS/prism/issues/2801#issue-829717504}
	 */
	Prism.languages['false'] = {
		'comment': {
			pattern: /\{[^}]*\}/
		},
		'string': {
			pattern: /"[^"]*"/,
			greedy: true
		},
		'character-code': {
			pattern: /'[\S\s]/,
			alias: 'number'
		},
		'assembler-code': {
			pattern: /\d+`/,
			alias: 'important'
		},
		'number': /\d+/,
		'operator': /[-!#$%&'*+,./:;=>?@\\^_`|~\xdf\xf8]/,
		'punctuation': /\[|\]/,
		'variable': /[a-z]/,
		'non-standard': {
			pattern: /[()<BDO\xae]/,
			alias: 'bold'
		}
	};
}(Prism));
