import markupTemplating from './prism-markup-templating.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'smarty',
	require: markupTemplating,
	optional: 'php',
	grammar({ getLanguage }) {
		Prism.languages.smarty = {
			'comment': {
				pattern: /^\{\*[\s\S]*?\*\}/,
				greedy: true
			},
			'embedded-php': {
				pattern: /^\{php\}[\s\S]*?\{\/php\}/,
				greedy: true,
				inside: {
					'smarty': {
						pattern: /^\{php\}|\{\/php\}$/,
						inside: 'smarty'
					},
					'php': {
						pattern: /[\s\S]+/,
						alias: 'language-php',
						inside: 'php'
					}
				}
			},
			'string': [
				{
					pattern: /"(?:\\.|[^"\\\r\n])*"/,
					greedy: true,
					inside: {
						'interpolation': {
							pattern: /\{[^{}]*\}|`[^`]*`/,
							inside: {
								'interpolation-punctuation': {
									pattern: /^[{`]|[`}]$/,
									alias: 'punctuation'
								},
								'expression': {
									pattern: /[\s\S]+/,
									inside: 'smarty'
								}
							}
						},
						'variable': /\$\w+/
					}
				},
				{
					pattern: /'(?:\\.|[^'\\\r\n])*'/,
					greedy: true
				},
			],
			'keyword': {
				pattern: /(^\{\/?)[a-z_]\w*\b(?!\()/i,
				lookbehind: true,
				greedy: true
			},
			'delimiter': {
				pattern: /^\{\/?|\}$/,
				greedy: true,
				alias: 'punctuation'
			},
			'number': /\b0x[\dA-Fa-f]+|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee][-+]?\d+)?/,
			'variable': [
				/\$(?!\d)\w+/,
				/#(?!\d)\w+#/,
				{
					pattern: /(\.|->|\w\s*=)(?!\d)\w+\b(?!\()/,
					lookbehind: true
				},
				{
					pattern: /(\[)(?!\d)\w+(?=\])/,
					lookbehind: true
				}
			],
			'function': {
				pattern: /(\|\s*)@?[a-z_]\w*|\b[a-z_]\w*(?=\()/i,
				lookbehind: true
			},
			'attr-name': /\b[a-z_]\w*(?=\s*=)/i,
			'boolean': /\b(?:false|no|off|on|true|yes)\b/,
			'punctuation': /[\[\](){}.,:`]|->/,
			'operator': [
				/[+\-*\/%]|==?=?|[!<>]=?|&&|\|\|?/,
				/\bis\s+(?:not\s+)?(?:div|even|odd)(?:\s+by)?\b/,
				/\b(?:and|eq|gt?e|gt|lt?e|lt|mod|neq?|not|or)\b/
			]
		};

		let string = /"(?:\\.|[^"\\\r\n])*"|'(?:\\.|[^'\\\r\n])*'/;
		let smartyPattern = RegExp(
			// comments
			/\{\*[\s\S]*?\*\}/.source +
				'|' +
				// php tags
				/\{php\}[\s\S]*?\{\/php\}/.source +
				'|' +
				// smarty blocks
				/\{(?:[^{}"']|<str>|\{(?:[^{}"']|<str>|\{(?:[^{}"']|<str>)*\})*\})*\}/.source
					.replace(/<str>/g, function () { return string.source; }),
			'g'
		);

		// Tokenize all inline Smarty expressions
		Prism.hooks.add('before-tokenize', function (env) {
			let smartyLiteralStart = '{literal}';
			let smartyLiteralEnd = '{/literal}';
			let smartyLiteralMode = false;

			Prism.languages['markup-templating'].buildPlaceholders(env, 'smarty', smartyPattern, function (match) {
				// Smarty tags inside {literal} block are ignored
				if (match === smartyLiteralEnd) {
					smartyLiteralMode = false;
				}

				if (!smartyLiteralMode) {
					if (match === smartyLiteralStart) {
						smartyLiteralMode = true;
					}

					return true;
				}
				return false;
			});
		});

		// Re-insert the tokens after tokenizing
		Prism.hooks.add('after-tokenize', function (env) {
			Prism.languages['markup-templating'].tokenizePlaceholders(env, 'smarty');
		});
	}
});
