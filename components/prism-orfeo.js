(function (Prism) {
	Prism.languages.orfeo = {
		'parenthesis-open': {
			pattern: /(^|[(^\s])\((?=[^.]|$)/,
			alias: 'punctuation',
			lookbehind: true
		},
		'parenthesis-close': {
			pattern: /(^|[^^])\)(?=[).\s]|$)/,
			alias: 'punctuation',
			lookbehind: true
		},
		'duration': {
			pattern: /(^|[(\s]):(?:=|(?:\.\d+|(?:0|[1-9]\d*)(?:\.\d*)?)(?:\/(?:0?\.0*[1-9]\d*|[1-9]\d*(?:\.\d*)?))?)(?=[)\s]|$)/,
			alias: 'number',
			lookbehind: true
		},
		'datum-quoted': {
			pattern: /(^|[(^\s])"[^"]*"(?=[).\s]|$)/,
			alias: 'string',
			lookbehind: true
		},
		'datum-unquoted': {
			pattern: /(^|[(^\s])[.\w/\[\]♮♭♯-]*[\w/\[\]♮♭♯-](?=[).\s]|$)/,
			alias: 'string',
			lookbehind: true
		},
		'rhythm-flags': {
			pattern: /(^|[(\s])\^+(?=\(|"[^"]*"|[.\w/\[\]♮♭♯-]*[\w/\[\]♮♭♯-]|$)/,
			alias: 'operator',
			lookbehind: true
		},
		'rhythm-dots': {
			pattern: /(^|[)"\w/\[\]♮♭♯-])\.+(?=[)\s]|$)/,
			alias: 'operator',
			lookbehind: true
		},
	}
}(Prism))
