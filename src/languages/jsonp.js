import { insertBefore } from '../util/language-util.js';
import json from './json.js';

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
