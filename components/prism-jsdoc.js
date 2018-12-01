(function (Prism) {

	var javascript = Prism.languages.javascript;

	var type = /\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})+\}/.source;

	Prism.languages.jsdoc = Prism.languages.extend('javadoclike', {
		'parameter': {
			pattern: /(@(?:param|arg|argument)\s+(?:\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})+\}\s+)?)(?:\w+|\[\w+(?:=[^[[\]]+)?\])(?=\s|$)/,
			lookbehind: true,
			inside: {
				'code': {
					pattern: /(\w=)[^[[\]]+(?=\]$)/,
					lookbehind: true,
					inside: javascript,
					alias: 'language-javascript'
				},
				'punctuation': /[=[\]]/
			}
		}
	});

	Prism.languages.insertBefore('jsdoc', 'keyword', {
		'class-name': [
			{
				pattern: /(@[a-z]+\s+)\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})+\}/,
				lookbehind: true,
				inside: {
					'punctuation': /[.,:?=<>|{}()[\]]/
				}
			},
			{
				pattern: /(@(?:augments|extends|class|interface|memberof!?|this)\s+)[A-Z]\w*(?:\.[A-Z]\w*)*/,
				lookbehind: true,
				inside: {
					'punctuation': /\./
				}
			}
		],
		'example': {
			pattern: /(@example\s+)[^@]+?(?=\s*(?:\*\s*)?(?:@\w|\*\/))/,
			lookbehind: true,
			inside: {
				'code': {
					pattern: /^(\s*(?:\*\s*)?).+$/m,
					lookbehind: true,
					inside: javascript,
					alias: 'language-javascript'
				}
			}
		}
	});

	Prism.languages.javadoclike.addSupport(['javascript'], Prism.languages.jsdoc);

}(Prism));
