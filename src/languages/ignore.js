import registry from '../registry.js';

/** @type {import('../types.d.ts').LanguageProto<'ignore'>} */
const Self = {
	id: 'ignore',
	alias: ['gitignore', 'hgignore', 'npmignore'],
	grammar: {
		// https://git-scm.com/docs/gitignore
		'comment': /^#.*/m,
		'entry': {
			pattern: /\S(?:.*(?:(?:\\ )|\S))?/,
			alias: 'string',
			inside: {
				'operator': /^!|\*\*?|\?/,
				'regex': {
					pattern: /(^|[^\\])\[[^\[\]]*\]/,
					lookbehind: true,
				},
				'punctuation': /\//,
			},
		},
	},
};

export default Self;

registry.add(Self);
