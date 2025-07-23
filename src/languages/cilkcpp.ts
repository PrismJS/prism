import { insertBefore } from '../util/language-util';
import cpp from './cpp';
import type { LanguageProto } from '../types';

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
} as LanguageProto<'cilkcpp'>;
