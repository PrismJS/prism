import { insertBefore } from '../util/language-util';
import json from './json';
import type { LanguageProto } from '../types';

export default {
	id: 'jsonp',
	base: json,
	grammar ({ base }) {
		insertBefore(base, 'punctuation', {
			'function': /(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*\()/,
		});

		return {
			'punctuation': /[{}[\]();,.]/,
		};
	},
} as LanguageProto<'jsonp'>;
