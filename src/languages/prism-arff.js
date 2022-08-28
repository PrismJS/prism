export default /** @type {import("../types").LanguageProto<'arff'>} */ ({
	id: 'arff',
	grammar: {
		'comment': /%.*/,
		'string': {
			pattern: /(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,
			greedy: true
		},
		'keyword': /@(?:attribute|data|end|relation)\b/i,
		'number': /\b\d+(?:\.\d+)?\b/,
		'punctuation': /[{},]/
	}
});
