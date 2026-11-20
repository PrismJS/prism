import registry from '../registry.js';

/** @type {import('../types.d.ts').LanguageProto<'javadoclike'>} */
const Self = {
	id: 'javadoclike',
	grammar: {
		'parameter': {
			pattern: /(^[\t ]*(?:\/{3}|\*|\/\*\*)\s*@(?:arg|arguments|param)\s+)\w+/m,
			lookbehind: true,
		},
		'keyword': {
			// keywords are the first word in a line preceded be an `@` or surrounded by curly braces.
			// @word, {@word}
			pattern: /(^[\t ]*(?:\/{3}|\*|\/\*\*)\s*|\{)@[a-z][a-zA-Z-]+\b/m,
			lookbehind: true,
		},
		'punctuation': /[{}]/,
	},
};

export default Self;

registry.add(Self);
