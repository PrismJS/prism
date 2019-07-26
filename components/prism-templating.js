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
	 * @property {GetPlaceholderFn} [getPlaceholder]
	 * @property {GetValueFn} [getValue]
	 *
	 * @callback GetPlaceholderFn
	 * @param {number} counter
	 * @returns {string}
	 *
	 * @callback GetValueFn
	 * @param {Token} token
	 * @returns {string|Token|TokenStream}
	 */


	function defaultGetPlaceholder(counter) {
		return '___PLACEHOLDER_' + counter + '___';
	}
	function defaultGetValue(token) {
		return token;
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
	 * The given code will be tokenized using the grammar of the given options. All toplevel tokens will then be
	 * replaced by placeholders except for tokens with a type that starts with `ignore`.
	 *
	 * Use the `getPlaceholder` function to return placeholders suited for your target language. The code with
	 * placeholders will be returned as part of the template and can then be tokenized by the target language.
	 *
	 * __It is important that the target language DOES NOT partly tokenize any placeholders. Placeholders have to
	 * be tokenized as a whole.__
	 *
	 * Then use the `interpolate` function to replace all placeholders in the token stream of the target languag with
	 * their values. The `getValue` function can be used to replace the placeholders with arbitrary tokens or
	 * a token stream.
	 *
	 * `interpolate` modifies the given token stream.
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

		/** @type {GetPlaceholderFn} */
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
				/** @type {GetValueFn} */
				var getValue = options.getValue || defaultGetValue;

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

						if (typeof token === 'string' || typeof token.content === 'string') {
							var placeholder = placeholders[placeholderCounter];
							var str = typeof token === 'string' ? token : /** @type {string} */ (token.content);

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
							/** @type {Token | TokenStream} */
							var content = token.content;
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
	 * @returns {TokenStream}
	 */
	function tokenizeWithHooks(code, grammar, language) {
		var env = {
			code: code,
			grammar: grammar,
			language: language
		};
		Prism.hooks.run('before-tokenize', env);
		env.tokens = Prism.tokenize(env.code, env.grammar);
		Prism.hooks.run('after-tokenize', env);
		return env.tokens;
	}


	Object.defineProperties(Prism.languages.templating = {}, {
		createTemplate: { value: createTemplate },
		tokenizeWithHooks: { value: tokenizeWithHooks }
	});

}(Prism));
