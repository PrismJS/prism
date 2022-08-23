export default /** @type {import("../types").LanguageProto} */ ({
	id: 'brainfuck',
	grammar: {
		'pointer': {
			pattern: /<|>/,
			alias: 'keyword'
		},
		'increment': {
			pattern: /\+/,
			alias: 'inserted'
		},
		'decrement': {
			pattern: /-/,
			alias: 'deleted'
		},
		'branching': {
			pattern: /\[|\]/,
			alias: 'important'
		},
		'operator': /[.,]/,
		'comment': /\S+/
	}
});
