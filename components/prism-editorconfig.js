Prism.languages.editorconfig = {
	// https://editorconfig-specification.readthedocs.io/en/latest/
	'comment': /[;#].*$/m,
	'section': {
		pattern: /^[ \t]*\[.+]/m,
		alias: 'keyword',
		inside: {
			'regex': /\\\\[\[\]{},!?.*]/, // Escape special characters with '\\'
			'punctuation': /[\[\]{},!?]|\.\.|\*{1,2}/
		}
	},
	'property': /^[ \t]*[^\s=]+?(?=[ \t]*=)/m,
	'value': {
		pattern: /=.*/,
		alias: 'string',
		inside: {
			'punctuation': /^[=]/
		}
	}
};
