export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['hsts']) {
      return
    }
	/**
 	* Original by Scott Helme.
 	*
 	* Reference: https://scotthelme.co.uk/hsts-cheat-sheet/
 	*/

	Prism.languages.hsts = {
		'directive': {
			pattern: /\b(?:includeSubDomains|max-age|preload)(?=[\s;=]|$)/i,
			alias: 'property'
		},
		'operator': /=/,
		'punctuation': /;/
	};
}