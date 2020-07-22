(function (Prism) {
	Prism.languages.ignore = {
		// https://git-scm.com/docs/gitignore
		'header': {
			pattern: /^###.*/m,
			alias: ['comment', 'bold']
		},
		'section': {
			pattern: /^##.*/m,
			alias: 'comment'
		},
		'comment': {
			pattern: /^#.*/m,
			alias: 'namespace'
		},
		'entry': {
			pattern: /\S(?:.*(?:(?:\\ )|\S))?/,
			alias: 'string',
			inside: {
				'operator': /^!|\*\*?|\?/,
				'regex': {
					pattern: /(^|[^\\])\[[^\[\]]*\]/,
					lookbehind: true
				},
				'punctuation': /\//
			}
		}
	};

	Prism.languages.gitignore = Prism.languages.ignore
	Prism.languages.hgignore = Prism.languages.ignore
	Prism.languages.npmignore = Prism.languages.ignore

}(Prism));
