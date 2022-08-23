import php from './prism-php.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'php-extras',
	require: php,
	grammar({ getLanguage }) {
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
});
