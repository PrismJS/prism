/**
* @param {import("../prism.js").Prism} Prism
* @param {import("../prism.js").LoaderOptions} [options]
*/
import { loader as phpLoader } from "./prism-php.js"

export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['php-extras']) {
      return
    }

	Prism.languages['php-extras'] = {}

    phpLoader(Prism)

	Prism.languages.insertBefore('php', 'variable', {
		'this': {
			pattern: /\$this\b/,
			alias: 'keyword'
		},
		'global': /\$(?:GLOBALS|HTTP_RAW_POST_DATA|_(?:COOKIE|ENV|FILES|GET|POST|REQUEST|SERVER|SESSION)|argc|argv|http_response_header|php_errormsg)\b/,
		'scope': {
			pattern: /\b[\w\\]+::/,
			inside: {
				'keyword': /\b(?:parent|self|static)\b/,
				'punctuation': /::|\\/
			}
		}
	});
}