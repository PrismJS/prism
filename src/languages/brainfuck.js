import registry from '../registry.js';

/** @type {import('../types.d.ts').LanguageProto<'brainfuck'>} */
const Self = {
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

export default Self;

registry.add(Self);
