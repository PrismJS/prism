import registry from '../registry.js';

/** @type {import('../types.d.ts').LanguageProto<'editorconfig'>} */
const Self = {
	id: 'editorconfig',
	grammar: {
		// https://editorconfig-specification.readthedocs.io
		'comment': /[;#].*/,
		'section': {
			pattern: /(^[ \t]*)\[.+\]/m,
			lookbehind: true,
			alias: 'selector',
			inside: {
				'regex': /\\\\[\[\]{},!?.*]/, // Escape special characters with '\\'
				'operator': /[!?]|\.\.|\*{1,2}/,
				'punctuation': /[\[\]{},]/,
			},
		},
		'key': {
			pattern: /(^[ \t]*)[^\s=]+(?=[ \t]*=)/m,
			lookbehind: true,
			alias: 'attr-name',
		},
		'value': {
			pattern: /=.*/,
			alias: 'attr-value',
			inside: {
				'punctuation': /^=/,
			},
		},
	},
};

export default Self;

registry.add(Self);
