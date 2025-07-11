import scheme from './scheme';
import type { LanguageProto } from '../types';

export default {
	id: 'racket',
	base: scheme,
	alias: 'rkt',
	grammar () {
		return {
			'lambda-parameter': {
				// the racket lambda syntax is a lot more complex, so we won't even attempt to capture it.
				// this will just prevent false positives of the `function` pattern
				pattern: /([(\[]lambda\s+[(\[])[^()\[\]'\s]+/,
				lookbehind: true,
			},
			$insert: {
				'lang': {
					$before: 'string',
					pattern: /^#lang.+/m,
					greedy: true,
					alias: 'keyword',
				},
			},
		};
	},
} as LanguageProto<'racket'>;
