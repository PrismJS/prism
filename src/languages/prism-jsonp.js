import json from './prism-json.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'jsonp',
	require: json,
	grammar({ extend, getLanguage }) {
		Prism.languages.jsonp = extend('json', {
			'punctuation': /[{}[\]();,.]/
		});

		Prism.languages.insertBefore('jsonp', 'punctuation', {
			'function': /(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*\()/
		});
	}
});
