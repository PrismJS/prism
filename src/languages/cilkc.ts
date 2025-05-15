import c from './c';
import type { LanguageProto } from '../types';

export default {
	id: 'cilkc',
	require: c,
	base: c,
	alias: 'cilk-c',
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
} as LanguageProto<'cilkc'>;
