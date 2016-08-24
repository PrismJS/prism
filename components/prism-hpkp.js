/**
 * Original by Scott Helme.
 *
 * Reference: https://scotthelme.co.uk/hpkp-cheat-sheet/
 */

Prism.languages.hpkp = {
	'directive':  {
             pattern: /(max-age=|includeSubDomains|preload|strict|report-uri=|report-to|pin-sha256=)/,
             alias: 'keyword'
        },
	'safe': {
            pattern: /([0-9]{7,})/,
            alias: 'selector'
        },
	'unsafe': {
            pattern: /([0-9]{0,6})/,
            alias: 'function'
        }
};