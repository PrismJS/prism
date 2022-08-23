import scheme from './prism-scheme.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'lilypond',
	require: scheme,
	alias: 'ly',
	grammar({ getLanguage }) {
		let schemeExpression = /\((?:[^();"#\\]|\\[\s\S]|;.*(?!.)|"(?:[^"\\]|\\.)*"|#(?:\{(?:(?!#\})[\s\S])*#\}|[^{])|<expr>)*\)/.source;
		// allow for up to pow(2, recursivenessLog2) many levels of recursive brace expressions
		// For some reason, this can't be 4
		let recursivenessLog2 = 5;
		for (let i = 0; i < recursivenessLog2; i++) {
			schemeExpression = schemeExpression.replace(/<expr>/g, function () { return schemeExpression; });
		}
		schemeExpression = schemeExpression.replace(/<expr>/g, /[^\s\S]/.source);


		return {
			'comment': /%(?:(?!\{).*|\{[\s\S]*?%\})/,
			'embedded-scheme': {
				pattern: RegExp(/(^|[=\s])#(?:"(?:[^"\\]|\\.)*"|[^\s()"]*(?:[^\s()]|<expr>))/.source.replace(/<expr>/g, function () { return schemeExpression; }), 'm'),
				lookbehind: true,
				greedy: true,
				inside: {
					'scheme': {
						pattern: /^(#)[\s\S]+$/,
						lookbehind: true,
						alias: 'language-scheme',
						inside: {
							'embedded-lilypond': {
								pattern: /#\{[\s\S]*?#\}/,
								greedy: true,
								inside: {
									'punctuation': /^#\{|#\}$/,
									'lilypond': {
										pattern: /[\s\S]+/,
										alias: 'language-lilypond',
										inside: 'lilypond'
									}
								}
							},
							rest: Prism.languages.scheme
						}
					},
					'punctuation': /#/
				}
			},
			'string': {
				pattern: /"(?:[^"\\]|\\.)*"/,
				greedy: true
			},
			'class-name': {
				pattern: /(\\new\s+)[\w-]+/,
				lookbehind: true
			},
			'keyword': {
				pattern: /\\[a-z][-\w]*/i,
				inside: {
					'punctuation': /^\\/
				}
			},
			'operator': /[=|]|<<|>>/,
			'punctuation': {
				pattern: /(^|[a-z\d])(?:'+|,+|[_^]?-[_^]?(?:[-+^!>._]|(?=\d))|[_^]\.?|[.!])|[{}()[\]<>^~]|\\[()[\]<>\\!]|--|__/,
				lookbehind: true
			},
			'number': /\b\d+(?:\/\d+)?\b/
		};
	}
});
