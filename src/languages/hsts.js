/** @type {import('../types.d.ts').LanguageProto<'hsts'>} */
export default {
	id: 'hsts',
	grammar () {
		/**
		 * Original by Scott Helme.
		 *
		 * Reference: https://scotthelme.co.uk/hsts-cheat-sheet/
		 */

		return {
			'directive': {
				pattern: /\b(?:includeSubDomains|max-age|preload)(?=[\s;=]|$)/i,
				alias: 'property',
			},
			'operator': /=/,
			'punctuation': /;/,
		};
	},
};
