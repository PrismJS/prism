import { insertBefore } from '../util/language-util.js';
import cpp from './cpp.js';

/** @type {import('../types.d.ts').LanguageProto<'cilkcpp'>} */
export default {
	id: 'cilkcpp',
	base: cpp,
	alias: ['cilk-cpp', 'cilk'],
	grammar ({ base }) {
		insertBefore(base, 'function', {
			'parallel-keyword': {
				pattern: /\bcilk_(?:for|reducer|s(?:cope|pawn|ync))\b/,
				alias: 'keyword',
			},
		});
		return {};
	},
};
