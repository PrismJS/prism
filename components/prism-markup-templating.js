(function (Prism) {

	var createTemplate = Prism.languages.templating.createTemplate;

	Object.defineProperties(Prism.languages['markup-templating'] = {}, {
		buildPlaceholders: {
			/**
			 * Tokenize all inline templating expressions matching `placeholderPattern`.
			 *
			 * @param {object} env The environment of the `before-tokenize` hook.
			 * @param {string} language The language id.
			 * @param {RegExp|Object<string, any>} placeholderPatternOrGrammar The pattern of templating grammar which
			 * matches the parts of the code that will be replaced with placeholders.
			 */
			value: function (env, language, placeholderPatternOrGrammar) {
				if (env.language !== language) {
					return;
				}

				var grammar;
				if (Prism.util.type(placeholderPatternOrGrammar) === 'RegExp') {
					grammar = {};
					grammar[language] = {
						pattern: placeholderPatternOrGrammar,
						alias: 'language-' + language
					};
				} else {
					grammar = placeholderPatternOrGrammar;
				}

				var template = createTemplate(env.code, {
					grammar: grammar,
					getValue: function (token) {
						token.content = Prism.tokenize(token.content, Prism.languages[language]);
						return token;
					}
				});

				env.code = template.code;
				env.interpolate = template.interpolate;

				// Switch the grammar to markup
				env.grammar = Prism.languages.markup;
			}
		},
		tokenizePlaceholders: {
			/**
			 * Replace placeholders with proper tokens after tokenizing.
			 *
			 * @param {object} env The environment of the `after-tokenize` hook.
			 * @param {string} language The language id.
			 */
			value: function (env, language) {
				var interpolate = env.interpolate;

				if (env.language !== language || !interpolate) {
					return;
				}

				// Switch the grammar back
				env.grammar = Prism.languages[language];

				interpolate(env.tokens);
			}
		}
	});

}(Prism));
