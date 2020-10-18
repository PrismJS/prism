(function (Prism) {
	Prism.languages.orfeo = {
		'parenthesis-open': {
			pattern: /(^|\(|\^|\s)\((?=[^\.]|$)/,
			alias: 'punctuation',
			lookbehind: true
		},
		'parenthesis-close': {
			pattern: /(^|[^^])\)(?=\)|\.|\s|$)/,
			alias: 'punctuation',
			lookbehind: true
		},
		'duration': {
			pattern: /(^|\(|\s):(?:=|(?:\.[0-9]+|(?:0|[1-9][0-9]*)(?:\.[0-9]*)?)(?:\/(?:0?\.[0-9]*[1-9][0-9]*|[1-9][0-9]*(?:\.[0-9]*)?))?)(?=\)|\s|$)/,
			alias: 'number',
			lookbehind: true
		},
		'datum-quoted': {
			pattern: /(^|\(|\^|\s)"[^"]*"(?=\)|\.|\s|$)/,
			alias: 'string',
			lookbehind: true
		},
		'datum-unquoted': {
			pattern: /(^|\(|\^|\s)(?:\.*[_a-zA-Z0-9/\[\]♮♭♯-]+)+(?=\)|\.|\s|$)/,
			alias: 'string',
			lookbehind: true
		},
		'rhythm-flags': {
			pattern: /(^|\(|\s)\^+(?=\(|"[^"]*"|(?:\.*[_a-zA-Z0-9/\[\]♮♭♯-]+)+|$)/,
			alias: 'operator',
			lookbehind: true
		},
		'rhythm-dots': {
			pattern: /(^|\)|"|[_a-zA-Z0-9/\[\]♮♭♯-])\.+(?=\)|\s|$)/,
			alias: 'operator',
			lookbehind: true
		},
	}
}(Prism))
