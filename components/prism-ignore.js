(function (Prism) {
	Prism.languages.ignore = {
		// https://git-scm.com/docs/gitignore
		'header': {
			pattern: /(^|[^\\])###.*/,
			lookbehind: true,
			alias: ['comment', 'bold']
		},
		'section': {
			pattern: /(^|[^\\])##.*/,
			lookbehind: true,
			alias: 'comment'
		},
		'comment': {
			pattern: /(^|[^\\])#.*/,
			lookbehind: true,
			alias: 'namespace'
		},
		'entry': {
			pattern: /\S(?:.*(?:(?:\\ )|\S))?/,
			alias: 'string',
			inside: {
				'regex': {
					pattern: /^!|(^|[^\\])[\[\]]/,
					lookbehind: true
				},
				'punctuation': /\//
			}
		}
	};

	Prism.languages.gitignore = Prism.languages.ignore

}(Prism));
