import cpp from './cpp';
import type { LanguageProto } from '../types';

export default {
	id: 'cilkcpp',
	require: cpp,
	base: cpp,
	alias: ['cilk-cpp', 'cilk'],
	grammar () {
		return {
			$insertBefore: {
				'function': {
					'parallel-keyword': {
						pattern: /\bcilk_(?:for|reducer|s(?:cope|pawn|ync))\b/,
						alias: 'keyword',
					},
				},
			},
		};
	},
} as LanguageProto<'cilkcpp'>;
