import registry from '../registry.js';
import markup from './markup.js';

/** @type {import('../types.d.ts').LanguageProto<'xml-doc'>} */
const Self = {
	id: 'xml-doc',
	require: markup,
	grammar ({ languages }) {
		const tag = languages.markup.tag;

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

export default Self;

registry.add(Self);
