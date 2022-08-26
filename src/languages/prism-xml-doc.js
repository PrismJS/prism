import markup from './prism-markup.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'xml-doc',
	require: markup,
	grammar({ getLanguage }) {
		const tag = getLanguage('markup').tag;

		return {
			'slash': {
				pattern: /\/\/\/.*/,
				greedy: true,
				alias: 'comment',
				inside: {
					'tag': tag
				}
			},
			'tick': {
				pattern: /'''.*/,
				greedy: true,
				alias: 'comment',
				inside: {
					'tag': tag
				}
			}
		};
	}
});
