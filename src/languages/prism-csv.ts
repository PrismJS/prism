import type { LanguageProto } from '../types';

export default {
	id: 'csv',
	grammar() {
		// https://tools.ietf.org/html/rfc4180

		return {
			'value': /[^\r\n,"]+|"(?:[^"]|"")*"(?!")/,
			'punctuation': /,/
		};
	}
} as LanguageProto<'csv'>;
