/**
 * Original by Scott Helme.
 *
 * Reference: https://scotthelme.co.uk/csp-cheat-sheet/
 *
 * Supports the following:
 *  - CSP Level 1
 *  - CSP Level 2
 *  - CSP Level 3
 */

Prism.languages.csp = {
	'directive':  {
             pattern: /\b(base-uri|block-all-mixed-content|child-src|connect-src|default-src|disown-opener|font-src|form-action|frame-ancestors|frame-src|img-src|manifest-src|media-src|object-src|plugin-types|referrer|reflected-xss|report-to|report-uri |require-sri-for|sandbox|script-src|style-src|upgrade-insecure-requests|worker-src)\b/i,
             alias: 'keyword'
        },
	'safe': {
            pattern: /('self'|'none'|'strict-dynamic'|('nonce-|'sha256-)[a-zA-Z0-9]{1,}('))/,
            alias: 'selector'
        },
	'unsafe': {
            pattern: /('unsafe-inline'|'unsafe-eval'|'unsafe-hashed-attributes'|\*)/,
            alias: 'function'
        }
};