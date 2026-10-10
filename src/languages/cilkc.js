import registry from '../registry.js';
import c from './c.js';

/** @type {import('../types.d.ts').LanguageProto<'cilkc'>} */
const Self = {
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

export default Self;

registry.add(Self);
