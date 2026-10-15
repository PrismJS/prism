import registry from '../registry.js';
import json from './json.js';

/** @type {import('../types.d.ts').LanguageProto<'jsonp'>} */
const Self = {
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
};

export default Self;

registry.add(Self);
