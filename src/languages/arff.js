import registry from '../registry.js';

/** @type {import('../types.d.ts').LanguageProto<'arff'>} */
const Self = {
	id: 'arff',
	grammar: {
		'comment': /%.*/,
		'string': {
			pattern: /(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,
			greedy: true,
		},
		'keyword': /@(?:attribute|data|end|relation)\b/i,
		'number': /\b\d+(?:\.\d+)?\b/,
		'punctuation': /[{},]/,
	},
};

export default Self;

registry.add(Self);
