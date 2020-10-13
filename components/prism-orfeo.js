(function (Prism) {
	Prism.languages.orfeo = {
		'parenthesis_open': {
			pattern: /(^|\(|\^|\s)\((?=[^\.]|$)/,
			alias: 'punctuation',
			lookbehind: true
		},
		'parenthesis_close': {
			pattern: /(^|[^^])\)(?=\)|\.|\s|$)/,
			alias: 'punctuation',
			lookbehind: true
		},
		'duration': {
			pattern: /(^|\(|\s):(?:=|(?:\.[0-9]+|(?:0|[1-9][0-9]*)(?:\.[0-9]*)?)(?:\/(?:0?\.[0-9]*[1-9][0-9]*|[1-9][0-9]*(?:\.[0-9]*)?))?)(?=\)|\s|$)/,
			alias: 'number',
			lookbehind: true
		},
		'datum_quoted': {
			pattern: /(^|\(|\^|\s)"[^"]*"(?=\)|\.|\s|$)/,
			alias: 'string',
			lookbehind: true
		},
		'datum_unquoted': {
			pattern: /(^|\(|\^|\s)(?:\.*[_a-zA-Z0-9/\[\]♮♭♯-]+)+(?=\)|\.|\s|$)/,
			alias: 'string',
			lookbehind: true
		},
		'rhythm_flags': {
			pattern: /(^|\(|\s)\^+(?=\(|"[^"]*"|(?:\.*[_a-zA-Z0-9/\[\]♮♭♯-]+)+|$)/,
			alias: 'operator',
			lookbehind: true
		},
		'rhythm_dots': {
			pattern: /(^|\)|"|[_a-zA-Z0-9/\[\]♮♭♯-])\.+(?=\)|\s|$)/,
			alias: 'operator',
			lookbehind: true
		},
	}
}(Prism))
