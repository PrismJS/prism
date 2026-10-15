import registry from '../registry.js';

/** @type {import('../types.d.ts').LanguageProto<'php-extras'>} */
const Self = {
	id: 'php-extras',
	grammar: {
		'this': {
			pattern: /\$this\b/,
			alias: 'keyword',
		},
		'global':
			/\$(?:GLOBALS|HTTP_RAW_POST_DATA|_(?:COOKIE|ENV|FILES|GET|POST|REQUEST|SERVER|SESSION)|argc|argv|http_response_header|php_errormsg)\b/,
		'scope': {
			pattern: /\b[\w\\]+::/,
			inside: {
				'keyword': /\b(?:parent|self|static)\b/,
				'punctuation': /::|\\/,
			},
		},
	},
};

export default Self;

registry.add(Self);
