import cpp from './prism-cpp.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'cilkcpp',
	require: cpp,
	alias: ['cilk-cpp','cilk'],
	grammar({ getLanguage }) {
		Prism.languages.cilkcpp = Prism.languages.insertBefore('cpp', 'function', {
			'parallel-keyword': {
				pattern: /\bcilk_(?:for|reducer|s(?:cope|pawn|ync))\b/,
				alias: 'keyword'
			}
		});
	}
});
