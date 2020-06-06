(function (Prism) {

	/**
	 * @typedef Token
	 * @property {string} type
	 * @property {string|Token|(string|Token)[]} content
	 * @property {string|string[]} [alias]
	 *
	 * @typedef {(string|Token)[]} TokenStream
	 *
	 * @typedef {Object<string, RegExp|Array|Object<string, any>>} Grammar
	 *
	 * @typedef Template
	 * @property {string} code
	 * @property {(tokens: TokenStream) => void} interpolate
	 *
	 * @typedef TemplateOptions
	 * @property {Grammar} grammar
	 * @property {(counter: number) => string} [getPlaceholder]
	 * @property {(token: Token) => string|Token|TokenStream} getValue
	 */


	function defaultGetPlaceholder(counter) {
		return '___PLACEHOLDER_' + counter + '___';
	}

	/**
	 * Returns the string content of a token or token stream.
	 *
	 * @param {string | Token | (string | Token)[]} value
	 * @returns {string}
	 */
	function stringContent(value) {
		if (typeof value === 'string') {
			return value;
		} else if (Array.isArray(value)) {
			return value.map(stringContent).join('');
		} else {
			return stringContent(value.content);
		}
	}


	/**
	 * Create a new template from the given code and options.
	 *
	 * The given code will be tokenized using the grammar of the given options. All top-level tokens will then be
	 * replaced by placeholders except for tokens with a type that starts with `ignore`.
	 *
	 * Use the `getPlaceholder` function to return placeholders suited for your target language. The code with
	 * placeholders will be returned as part of the template and can then be tokenized by the target language.
	 *
	 * __It is important that the target language DOES NOT partly tokenize any placeholders. Placeholders have to
	 * be tokenized as a whole.__
	 *
	 * Then use the `interpolate` function to replace all placeholders in the token stream of the target language with
	 * their values. The `getValue` function can be used to replace the placeholders with arbitrary tokens or
	 * a token stream.
	 *
	 * `interpolate` modifies its given token stream.
	 *
	 * @param {string} code
	 * @param {TemplateOptions} options
	 * @returns {Template}
	 * @example
	 * const template = createTemplate(myCode, {
	 *     grammar: {
	 *         'ignore-this': /\/\/.+/,
	 *         'value': /{[^}]*}/
	 *     },
	 *     getValue(token) {
	 *         return Prism.tokenize(token.content, Prism.languages.embeddedLanguage);
	 *     }
	 * });
	 *
	 * const tokens = Prism.tokenize(template.code, Prism.languages.templateLanguage);
	 * template.interpolate(tokens);
	 * // tokens is now ready to be used
	 */
	function createTemplate(code, options) {
		/** @type {TokenStream} */
		var tokens = Prism.tokenize(code, options.grammar);

		var templateCode = '';
		/** @type {Object<string, Token>} */
		var placeholderMap = {};
		var placeholderCounter = 0;

		/** @type {TemplateOptions["getPlaceholder"]} */
		var getPlaceholder = options.getPlaceholder || defaultGetPlaceholder;

		for (var i = 0, l = tokens.length; i < l; i++) {
			var token = tokens[i];
			if (typeof token === 'string') {
				templateCode += token;
			} else if (/^ignore/.test(token.type)) {
				templateCode += stringContent(token);
			} else {
				var placeholder;
				while (code.indexOf(placeholder = getPlaceholder(placeholderCounter++)) !== -1) { }
				placeholderMap[placeholder] = token;
				templateCode += placeholder;
			}
		}

		return {
			code: templateCode,
			interpolate: function (tokens) {
				/** @type {TemplateOptions["getValue"]} */
				var getValue = options.getValue;

				var placeholders = Object.keys(placeholderMap);
				var placeholderCounter = 0;

				walkTokens(tokens);

				/**
				 * @param {TokenStream} tokens
				 * @returns {void}
				 */
				function walkTokens(tokens) {
					for (var i = 0; i < tokens.length; i++) {
						if (placeholderCounter >= placeholders.length) {
							return;
						}

						var token = tokens[i];

						/** @type {string|Token|TokenStream} */
						var content = typeof token === 'string' ? token : token.content;

						if (typeof content === 'string') {
							var placeholder = placeholders[placeholderCounter];
							var str = content;

							var index = str.indexOf(placeholder);
							if (index !== -1) {
								++placeholderCounter;

								var before = str.substring(0, index);
								var middle = getValue(placeholderMap[placeholder]);
								var after = str.substring(index + placeholder.length);

								/** @type {TokenStream} */
								var replacement = [];
								if (before) {
									replacement.push(before);
								}

								if (Array.isArray(middle)) {
									replacement.push.apply(replacement, middle);
								} else {
									replacement.push(middle);
								}

								if (after) {
									var afterTokens = [after];
									walkTokens(afterTokens);
									replacement.push.apply(replacement, afterTokens);
								}

								if (typeof token === 'string') {
									tokens.splice.apply(tokens, [i, 1].concat(replacement));
									i += replacement.length - 1;
								} else {
									token.content = replacement;
								}
							}
						} else {
							if (Array.isArray(content)) {
								walkTokens(content);
							} else {
								walkTokens([content]);
							}
						}
					}
				}
			}
		};
	}


	/**
	 * Returns the tokens of `Prism.tokenize` but also runs the `before-tokenize` and `after-tokenize` hooks.
	 *
	 * @param {string} code
	 * @param {Grammar} grammar
	 * @param {string} language
	 * @returns {(Token|string)[]}
	 */
	function tokenizeWithHooks(code, grammar, language) {
		var env = {
			code: code,
			grammar: grammar,
			language: language
		};
		var run = Prism.hooks.run;
		run('before-tokenize', env);
		env.tokens = Prism.tokenize(env.code, env.grammar);
		run('after-tokenize', env);
		return env.tokens;
	}


	/**
	 * @typedef TemplatingState
	 * @property {string} code The original code before being replaced with the placeholder version
	 * @property {Grammar} grammar The original grammar.
	 * @property {Template["interpolate"]} interpolate
	 */
	var TEMPLATING_STATE_PROPERTY_NAME = '__templatingState';

	/**
	 * This function is called on an environment of the `before-tokenize` hook and will replace the current grammar with
	 * the grammar of the given template language. The code to highlight will be replaced with the template code (see
	 * `createTemplate`).
	 *
	 * The `getValue` function of the template options should not access any values of the hook environment because this
	 * function will change its properties. This meaning that the state of certain properties may be changed at the time
	 * the `getValue` function is invoked.
	 *
	 * @param {string|Grammar} templatedLanguage
	 * @param {any} env The environment of the `before-tokenize` hook.
	 * @param {TemplateOptions} templateOptions The template options passed to `createTemplate`.
	 * @returns {void}
	 * @example
	 * Prism.hooks.add('before-tokenize', function (env) {
	 *     if (env.language !== 'smarty') {
	 *         return;
	 *     }
	 *
	 *     Prism.languages.templating.replaceWithTemplate('markup', env, {
	 *         grammar: {
	 *             'ignore-literal': {
	 *                 pattern: /({literal})[\s\S]+?(?={\/literal})/,
	 *                 lookbehind: true
	 *             },
	 *             'smarty': {
	 *                 pattern: /\{\*[\s\S]*?\*\}|\{[\s\S]+?\}/,
	 *                 alias: 'language-smarty'
	 *             }
	 *         },
	 *         getValue: function (token) {
	 *             token.content = Prism.tokenize(token.content, Prism.languages['smarty']);
	 *             return token;
	 *         }
	 *     });
	 * });
	 */
	function replaceWithTemplate(templatedLanguage, env, templateOptions) {
		if (typeof templatedLanguage === 'string') {
			templatedLanguage = Prism.languages[templatedLanguage];
		}

		var template = createTemplate(env.code, templateOptions);

		/** @type {TemplatingState} */
		var templatingState = {
			grammar: env.grammar,
			code: env.code,
			interpolate: template.interpolate
		};

		env.code = template.code;
		env.grammar = templatedLanguage;
		env[TEMPLATING_STATE_PROPERTY_NAME] = templatingState;
	}

	Prism.hooks.add('after-tokenize', function (env) {
		/** @type {TemplatingState | undefined} */
		var templatingState = env[TEMPLATING_STATE_PROPERTY_NAME];
		if (!templatingState) {
			return;
		}
		// delete state to make double-execution impossible
		delete env[TEMPLATING_STATE_PROPERTY_NAME];

		// switch back to original grammar and code
		env.code = templatingState.code;
		env.grammar = templatingState.grammar;

		templatingState.interpolate(env.tokens);
	});


	Object.defineProperties(Prism.languages.templating = {}, {
		createTemplate: { value: createTemplate },
		tokenizeWithHooks: { value: tokenizeWithHooks },
		replaceWithTemplate: { value: replaceWithTemplate }
	});

}(Prism));
