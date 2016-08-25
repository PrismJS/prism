/**
 * Original by Scott Helme.
 *
 * Reference: https://scotthelme.co.uk/hsts-cheat-sheet/
 */

Prism.languages.hsts = {
	'directive':  {
             pattern: /\b(?:max-age=|includeSubDomains|preload)/,
             alias: 'keyword'
        },
	'safe': {
            pattern: /[0-9]{8,}/,
            alias: 'selector'
        },
	'unsafe': {
            pattern: /[0-9]{0,7}/,
            alias: 'function'
        }
};