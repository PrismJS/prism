import registry from '../registry.js';

/** @type {import('../types.d.ts').LanguageProto<'csv'>} */
const Self = {
	id: 'csv',
	grammar () {
		// https://tools.ietf.org/html/rfc4180

		return {
			'value': /[^\r\n,"]+|"(?:[^"]|"")*"(?!")/,
			'punctuation': /,/,
		};
	},
};

export default Self;

registry.add(Self);
