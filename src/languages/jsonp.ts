import { insertBefore } from '../util/insert';
import json from './json';
import type { LanguageProto } from '../types';

export default {
	id: 'jsonp',
	require: json,
	grammar ({ extend }) {
		const jsonp = extend('json', {
			'punctuation': /[{}[\]();,.]/,
		});

		insertBefore(jsonp, 'punctuation', {
			'function': /(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*\()/,
		});

		return jsonp;
	},
} as LanguageProto<'jsonp'>;
