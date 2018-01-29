/**
 * Original by Scott Helme.
 *
 * Reference: https://scotthelme.co.uk/hpkp-cheat-sheet/
 */

Prism.languages.hpkp = {
	'directive':  {
             pattern: /\b(?:(?:includeSubDomains|preload|strict)(?: |;)|pin-sha256="[a-zA-Z0-9+=/]+"|(?:max-age|report-uri)=|report-to )/,
             alias: 'keyword'
        },
	'safe': {
            pattern: /[0-9]{7,}/,
            alias: 'selector'
        },
	'unsafe': {
            pattern: /[0-9]{0,6}/,
            alias: 'function'
        }
};