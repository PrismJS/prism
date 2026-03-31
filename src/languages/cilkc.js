import c from './c.js';

/** @type {import('../types.d.ts').LanguageProto<'cilkc'>} */
export default {
	id: 'cilkc',
	base: c,
	alias: 'cilk-c',
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
