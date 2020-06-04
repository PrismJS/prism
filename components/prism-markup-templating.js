(function (Prism) {

	var replaceWithTemplate = Prism.languages.templating.replaceWithTemplate;

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

				replaceWithTemplate('markup', env, {
					grammar: grammar,
					getValue: function (token) {
						token.content = Prism.tokenize(token.content, Prism.languages[language]);
						return token;
					}
				});
			}
		}
	});

}(Prism));
