/** @type {import('../types.d.ts').LanguageProto<'ignore'>} */
export default {
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
