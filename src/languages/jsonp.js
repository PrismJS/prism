import { insertBefore } from '../util/language-util.js';
import json from './json.js';

/** @type {import('../types.d.ts').LanguageProto<'jsonp'>} */
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
};
