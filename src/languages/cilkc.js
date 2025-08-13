import { insertBefore } from '../util/language-util.js';
import c from './c.js';

/** @type {import('../types.d.ts').LanguageProto<'cilkc'>} */
export default {
	id: 'cilkc',
	base: c,
	alias: 'cilk-c',
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
