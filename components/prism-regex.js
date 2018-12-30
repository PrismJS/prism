(function (Prism) {

	var escape = /\\(?:x[\da-fA-F]{2}|u[\da-fA-F]{4}|u\{\d+\}|c[a-zA-Z]|0[0-7]{0,2}|[123][0-7]{2}|[^bBdDkpPsSwW1-9])/
	var charClass = /\\[wsd]|\.|\\p{[^{}]+}/i

	var rangeChar = '(?:[^\\\\-]|' + escape.source + ')';
	var range = RegExp(rangeChar + '-' + rangeChar);

	// the name of a capturing group
	var groupName = {
		pattern: /(<)[^<>]+(?=>)/,
		lookbehind: true,
		alias: 'variable'
	};

	var backreference = [
		/\\[1-9]/,
		{
			pattern: /\\k<[^<>]+>/,
			inside: {
				'group-name': groupName
			}
		}
	];

	Prism.languages.regex = {
		'char-set': {
			pattern: /((?:^|[^\\])(?:\\\\)*)\[(?:[^\\\]]|\\[\s\S])*\]/,
			lookbehind: true,
			inside: {
				'char-set-punctuation': /^\[\^?|\]$/,
				'content': {
					pattern: /[\s\S]+/,
					lookbehind: true,
					inside: {
						'range': {
							pattern: range,
							inside: {
								'escape': escape,
								'delimiter': /-/
							}
						},
						'escape': escape,
						'char-class': charClass,
						'backreference': backreference
					}
				}
			}
		},
		'escape': escape,
		'char-class': charClass,
		'backreference': backreference,
		'group': [
			{
				// (), (?<name>), (?>), (?:), (?=), (?!), (?<=), (?<!)
				pattern: /\((?:\?(?:<[^<>]+>|[>:]|<?[=!]))?/,
				inside: {
					'group-name': groupName
				}
			},
			/\)/
		],
		'anchor': /[$^]|\\b/i,
		'quantifier': /[+*?]|\{(?:\d+,?\d*)\}/,
		'alternation': /\|/
	};


	[
		'actionscript',
		'coffescript',
		'flow',
		'javascript',
		'typescript',
		'vala'
	].forEach(function (lang) {
		var grammar = Prism.languages[lang];
		if (grammar) {
			grammar['regex'].inside = {
				'flags': /[a-z]+$/,
				'delimiter': /^\/|\/$/,
				'language-regex': {
					pattern: /[\s\S]+/,
					inside: Prism.languages.regex
				}
			};
		}
	});

}(Prism))
