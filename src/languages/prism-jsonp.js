import { insertBefore } from '../shared/language-util.js';
import json from './prism-json.js';

export default /** @type {import("../types").LanguageProto<'jsonp'>} */ ({
	id: 'jsonp',
	require: json,
	grammar({ extend }) {
		const jsonp = extend('json', {
			'punctuation': /[{}[\]();,.]/
		});

		insertBefore(jsonp, 'punctuation', {
			'function': /(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*\()/
		});

		return jsonp;
	}
});
