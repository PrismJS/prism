Prism.languages.editorconfig = {
	// https://editorconfig-specification.readthedocs.io/en/latest/
	'comment': /[;#].*/,
	'section': {
		pattern: /^[ \t]*\[.+]/m,
		alias: 'keyword',
		inside: {
			'regex': /\\\\[\[\]{},!?.*]/, // Escape special characters with '\\'
			'operator': /[!?]|\.\.|\*{1,2}/,
			'punctuation': /[\[\]{},]/
		}
	},
	'property': /^[ \t]*[^\s=]+(?=[ \t]*=)/m,
	'value': {
		pattern: /=.*/,
		alias: 'string',
		inside: {
			'punctuation': /^=/
		}
	}
};
