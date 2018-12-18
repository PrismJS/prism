(function (Prism) {

	var escape = /\\(?:x[\da-fA-F]{2}|u[\da-fA-F]{4}|u\{\d+\}|c[a-z]|0[0-7]{,2}|[^wsdb\d])/i
	var charClass = /\\[wsd]|\./i
	var rangeChar = '(?:[^\\\\-]|' + escape.source + ')';

	Prism.languages.regex = {
		'group': {
			pattern: /((?:^|[^\\])(?:\\\\)*)\((?:[^\\()]|\\[\s\S])*\)/,
			lookbehind: true,
			inside: {
				// TODO: doesn't work for (?:)
				'punctuation': /^\((?:\?(?:<?[=!]|[:>]))?|\)$/,
				'content': {
					pattern: /[\s\S]+/,
					inside: null
				}
			}
		},
		'charset': {
			pattern: /((?:^|[^\\])(?:\\\\)*)\[(?:[^\\]|\\[\s\S])*\]/,
			lookbehind: true,
			inside: {
				'punctuation': /^\[\^?|\]$/,
				'content': {
					pattern: /[\s\S]+/,
					inside: {
						'range': {
							pattern: RegExp(rangeChar + '-' + rangeChar, 'i'),
							inside: {
								'escape': escape,
								'punctuation': /-/
							}
						},
						'char-class': charClass,
						'escape': escape,
					}
				}
			}
		},
		'escape': escape,
		'char-class': charClass,
		'backreference': /\\[1-9]/,
		'anchor': /[$^]|\\b/i,
		'quantifiers': /[+*?|]|\{(?:\d+,?\d*|,\d+)\}/
	};

	Prism.languages.regex['group'].inside['content'].inside = Prism.languages.regex;

}(Prism))
