/** @type {import('../types.d.ts').LanguageProto<'brainfuck'>} */
export default {
	id: 'brainfuck',
	grammar: {
		'pointer': {
			pattern: /<|>/,
			alias: 'keyword',
		},
		'increment': {
			pattern: /\+/,
			alias: 'inserted',
		},
		'decrement': {
			pattern: /-/,
			alias: 'deleted',
		},
		'branching': {
			pattern: /\[|\]/,
			alias: 'important',
		},
		'operator': /[.,]/,
		'comment': /\S+/,
	},
};
