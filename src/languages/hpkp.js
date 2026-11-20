import registry from '../registry.js';

/** @type {import('../types.d.ts').LanguageProto<'hpkp'>} */
const Self = {
	id: 'hpkp',
	grammar () {
		/**
		 * Original by Scott Helme.
		 *
		 * Reference: https://scotthelme.co.uk/hpkp-cheat-sheet/
		 */

		return {
			'directive': {
				pattern:
					/\b(?:includeSubDomains|max-age|pin-sha256|preload|report-to|report-uri|strict)(?=[\s;=]|$)/i,
				alias: 'property',
			},
			'operator': /=/,
			'punctuation': /;/,
		};
	},
};

export default Self;

registry.add(Self);
