import { insertBefore } from '../util/language-util';
import c from './c';
import type { LanguageProto } from '../types';

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
} as LanguageProto<'cilkc'>;
