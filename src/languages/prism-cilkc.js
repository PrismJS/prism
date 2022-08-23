import c from './prism-c.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'cilkc',
	require: c,
	alias: 'cilk-c',
	grammar({ getLanguage }) {
		Prism.languages.cilkc = Prism.languages.insertBefore('c', 'function', {
			'parallel-keyword': {
				pattern: /\bcilk_(?:for|reducer|s(?:cope|pawn|ync))\b/,
				alias: 'keyword'
			}
		});
	}
});
