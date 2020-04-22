(function (Prism) {

	var codeLines = {
		'code': {
			pattern: /(^(?:\s*(?:\*\s*)*)).*[^*\s].*$/m,
			lookbehind: true,
			inside: Prism.languages.java,
			alias: 'language-java'
		}
	};

	var htmlCodeLines = {
		'code': {
			pattern: /(^(?:\s*(?:\*\s*)*)).*[^*\s].*$/m,
			lookbehind: true,
			inside: {
				'tag': Prism.languages.markup.tag,
				'entity': Prism.languages.markup.entity,
				'code': {
					pattern: /.+/,
					inside: Prism.languages.java,
					alias: 'language-java'
				}
			}
		}
	};

	var referencePattern = /(?:[a-zA-Z]\w+\s*\.\s*)*[A-Z]\w*(?:\s*#\s*\w+(?:\s*\([^()]*\))?)?|#\s*\w+(?:\s*\([^()]*\))?/.source;
	var referenceInside = {
		'function': {
			pattern: /(#\s*)\w+(?=\s*\()/,
			lookbehind: true
		},
		'field': {
			pattern: /(#\s*)\w+/,
			lookbehind: true
		},
		'namespace': {
			pattern: /\b(?:[a-z]\w*\s*\.\s*)+/,
			inside: {
				'punctuation': /\./
			}
		},
		'class-name': /\b[A-Z]\w*/,
		'keyword': Prism.languages.java.keyword,
		'punctuation': /[#()[\],.]/
	}

	Prism.languages.javadoc = Prism.languages.extend('javadoclike', {});
	Prism.languages.insertBefore('javadoc', 'keyword', {
		'reference': {
			pattern: RegExp(/(@(?:exception|throws|see|link|linkplain|value)\s+(?:\*\s*)?)/.source + '(?:' + referencePattern + ')'),
			lookbehind: true,
			inside: referenceInside
		},
		'class-name': {
			// @param <T> the first generic type parameter
			pattern: /(@param\s+)<[A-Z]\w*>/,
			lookbehind: true,
			inside: {
				'punctuation': /[.<>]/
			}
		},
		'code-section': [
			{
				pattern: /(\{@code\s+)(?:[^{}]|\{(?:[^{}]|\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\})*\})+?(?=\s*\})/,
				lookbehind: true,
				inside: codeLines
			},
			{
				pattern: /(<(code|pre|tt)>(?!<code>)\s*)[\s\S]+?(?=\s*<\/\2>)/,
				lookbehind: true,
				inside: htmlCodeLines
			}
		],
		'tag': Prism.languages.markup.tag,
		'entity': Prism.languages.markup.entity,
	});

	Prism.languages.javadoclike.addSupport('java', Prism.languages.javadoc);
}(Prism));
