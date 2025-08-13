import markup from './markup.js';

/** @type {import('../types.d.ts').LanguageProto<'xml-doc'>} */
export default {
	id: 'xml-doc',
	require: markup,
	grammar ({ getLanguage }) {
		const tag = getLanguage('markup').tag;

		return {
			'slash': {
				pattern: /\/\/\/.*/,
				greedy: true,
				alias: 'comment',
				inside: {
					'tag': tag,
				},
			},
			'tick': {
				pattern: /'''.*/,
				greedy: true,
				alias: 'comment',
				inside: {
					'tag': tag,
				},
			},
		};
	},
};
