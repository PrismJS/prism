import json from './json';
import type { LanguageProto } from '../types';

export default {
	id: 'jsonp',
	base: json,
	grammar () {
		return {
			'punctuation': /[{}[\]();,.]/,
			$insertBefore: {
				'punctuation': {
					'function': /(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*\()/,
				},
			},
		};
	},
} as LanguageProto<'jsonp'>;
