(function (Prism) {

	var variable = /\{[\$|\@|\|][\w\#\.\-\@\|\$\{\}]+\}/i;

	Prism.languages.causejs = {
		'comment': /\/\*[\s\S]*?\*\//,
		'atrule': {
			pattern: /@media [\s\S]*?(?:;|(?=\s*\{))/,
			inside: {
				'rule': /@[\w-]+/
				// See rest below
			}
		},
		'attr-value': {	// Using "selector" clashes with other ones, so this is instead of "selector".
			pattern: RegExp('(?![;\}\s\r\n\t]+)[~#\?a-zA-Z0-9\-\\[\\]_\.\:\,\r\n\"\=\(\) \.\{\}\@\$\|]+(?=[ ]?\{(?![\$\@\|]+))'),
			inside: {
				'variable': RegExp(variable.source),
				'event': {
					pattern: /:[\w]+[,| ]/,
					alias: 'selector'
				}
			}
		},
		'string': {
			pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
			inside: {
				'variable': RegExp(variable.source)
			}
		},
		'property': /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
		'variable': {
			pattern: variable,
			greedy: true
		},
		'function': /[\w]+(?=\()/i,
		'important': /after [0-9]+[m]?s/i,
		'punctuation': /[(){};:,]/
	};

	Prism.languages.causejs['atrule'].inside.rest = Prism.languages.causejs;

}(Prism));
