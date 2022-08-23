import { insertBefore } from '../shared/language-util.js';
import cpp from './prism-cpp.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'cilkcpp',
	require: cpp,
	alias: ['cilk-cpp', 'cilk'],
	grammar({ extend }) {
		const cilkcpp = extend('cpp', {});
		insertBefore(cilkcpp, 'function', {
			'parallel-keyword': {
				pattern: /\bcilk_(?:for|reducer|s(?:cope|pawn|ync))\b/,
				alias: 'keyword'
			}
		});
		return cilkcpp;
	}
});
