import cpp from './cpp.js';

/** @type {import('../types.d.ts').LanguageProto<'cilkcpp'>} */
export default {
	id: 'cilkcpp',
	base: cpp,
	alias: ['cilk-cpp', 'cilk'],
	grammar () {
		return {
			$insert: {
				'parallel-keyword': {
					$before: 'function',
					pattern: /\bcilk_(?:for|reducer|s(?:cope|pawn|ync))\b/,
					alias: 'keyword',
				},
			},
		};
	},
};
