(function (Prism) {

	var js = Prism.languages.javascript;

	Prism.languages.jsdoc = Prism.languages.extend('javadoclike', {
		'parameter': {
			pattern: /(@(?:param|arg|argument)\s+(?:\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})+\}\s+)?)(?:\w+|\[\w+(?:=[^[[\]]+)?\])(?=\s|$)/,
			lookbehind: true,
			inside: {
				'code': {
					pattern: /(\w=)[^[[\]]+(?=\]$)/,
					lookbehind: true,
					inside: js
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
					inside: js
				}
			}
		}
	});

	js['doc-comment'][0].inside.rest = Prism.languages.jsdoc;

}(Prism));
