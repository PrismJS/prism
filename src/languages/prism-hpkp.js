export default /** @type {import("../types").LanguageProto} */ ({
	id: 'hpkp',
	grammar() {
		/**
		 * Original by Scott Helme.
		 *
		 * Reference: https://scotthelme.co.uk/hpkp-cheat-sheet/
		 */

		return {
			'directive': {
				pattern: /\b(?:includeSubDomains|max-age|pin-sha256|preload|report-to|report-uri|strict)(?=[\s;=]|$)/i,
				alias: 'property'
			},
			'operator': /=/,
			'punctuation': /;/
		};
	}
});
