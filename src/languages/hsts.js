import registry from '../registry.js';

/** @type {import('../types.d.ts').LanguageProto<'hsts'>} */
const Self = {
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

export default Self;

registry.add(Self);
