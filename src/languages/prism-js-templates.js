import javascript from './prism-javascript.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'js-templates',
	require: javascript,
	optional: ['css', 'css-extras', 'graphql', 'markdown', 'markup', 'sql'],
	grammar({ getLanguage }) {
		const templateString = Prism.languages.javascript['template-string'];

		// see the pattern in prism-javascript.js
		const templateLiteralPattern = templateString.pattern.source;
		const interpolationObject = templateString.inside['interpolation'];
		const interpolationPunctuationObject = interpolationObject.inside['interpolation-punctuation'];
		const interpolationPattern = interpolationObject.pattern.source;


		/**
		 * Creates a new pattern to match a template string with a special tag.
		 *
		 * This will return `undefined` if there is no grammar with the given language id.
		 *
		 * @param {string} language The language id of the embedded language. E.g. `markdown`.
		 * @param {string} tag The regex pattern to match the tag.
		 * @returns {object | undefined}
		 * @example
		 * createTemplate('css', /\bcss/.source);
		 */
		function createTemplate(language, tag) {
			if (!Prism.languages[language]) {
				return undefined;
			}

			return {
				pattern: RegExp('((?:' + tag + ')\\s*)' + templateLiteralPattern),
				lookbehind: true,
				greedy: true,
				inside: {
					'template-punctuation': {
						pattern: /^`|`$/,
						alias: 'string'
					},
					'embedded-code': {
						pattern: /[\s\S]+/,
						alias: language
					}
				}
			};
		}


		Prism.languages.javascript['template-string'] = [
			// styled-jsx:
			//   css`a { color: #25F; }`
			// styled-components:
			//   styled.h1`color: red;`
			createTemplate('css', /\b(?:styled(?:\([^)]*\))?(?:\s*\.\s*\w+(?:\([^)]*\))*)*|css(?:\s*\.\s*(?:global|resolve))?|createGlobalStyle|keyframes)/.source),

			// html`<p></p>`
			// div.innerHTML = `<p></p>`
			createTemplate('html', /\bhtml|\.\s*(?:inner|outer)HTML\s*\+?=/.source),

			// svg`<path fill="#fff" d="M55.37 ..."/>`
			createTemplate('svg', /\bsvg/.source),

			// md`# h1`, markdown`## h2`
			createTemplate('markdown', /\b(?:markdown|md)/.source),

			// gql`...`, graphql`...`, graphql.experimental`...`
			createTemplate('graphql', /\b(?:gql|graphql(?:\s*\.\s*experimental)?)/.source),

			// sql`...`
			createTemplate('sql', /\bsql/.source),

			// vanilla template string
			templateString
		].filter(Boolean);


		/**
		 * Returns a specific placeholder literal for the given language.
		 *
		 * @param {number} counter
		 * @param {string} language
		 * @returns {string}
		 */
		function getPlaceholder(counter, language) {
			return '___' + language.toUpperCase() + '_' + counter + '___';
		}

		/**
		 * Returns the tokens of `Prism.tokenize` but also runs the `before-tokenize` and `after-tokenize` hooks.
		 *
		 * @param {string} code
		 * @param {any} grammar
		 * @param {string} language
		 * @returns {(string|Token)[]}
		 */
		function tokenizeWithHooks(code, grammar, language) {
			const env = {
				code,
				grammar,
				language
			};
			Prism.hooks.run('before-tokenize', env);
			env.tokens = Prism.tokenize(env.code, env.grammar);
			Prism.hooks.run('after-tokenize', env);
			return env.tokens;
		}

		/**
		 * Returns the token of the given JavaScript interpolation expression.
		 *
		 * @param {string} expression The code of the expression. E.g. `"${42}"`
		 * @returns {Token}
		 */
		function tokenizeInterpolationExpression(expression) {
			const tempGrammar = {};
			tempGrammar['interpolation-punctuation'] = interpolationPunctuationObject;

			/** @type {Array} */
			const tokens = Prism.tokenize(expression, tempGrammar);
			if (tokens.length === 3) {
				/**
				 * The token array will look like this
				 * [
				 *     ["interpolation-punctuation", "${"]
				 *     "..." // JavaScript expression of the interpolation
				 *     ["interpolation-punctuation", "}"]
				 * ]
				 */

				const args = [1, 1];
				args.push(...tokenizeWithHooks(tokens[1], Prism.languages.javascript, 'javascript'));

				tokens.splice.apply(tokens, args);
			}

			return new Prism.Token('interpolation', tokens, interpolationObject.alias, expression);
		}

		/**
		 * Tokenizes the given code with support for JavaScript interpolation expressions mixed in.
		 *
		 * This function has 3 phases:
		 *
		 * 1. Replace all JavaScript interpolation expression with a placeholder.
		 *    The placeholder will have the syntax of a identify of the target language.
		 * 2. Tokenize the code with placeholders.
		 * 3. Tokenize the interpolation expressions and re-insert them into the tokenize code.
		 *    The insertion only works if a placeholder hasn't been "ripped apart" meaning that the placeholder has been
		 *    tokenized as two tokens by the grammar of the embedded language.
		 *
		 * @param {string} code
		 * @param {object} grammar
		 * @param {string} language
		 * @returns {Token}
		 */
		function tokenizeEmbedded(code, grammar, language) {
			// 1. First filter out all interpolations

			// because they might be escaped, we need a lookbehind, so we use Prism
			/** @type {(Token|string)[]} */
			const _tokens = Prism.tokenize(code, {
				'interpolation': {
					pattern: RegExp(interpolationPattern),
					lookbehind: true
				}
			});

			// replace all interpolations with a placeholder which is not in the code already
			let placeholderCounter = 0;
			/** @type {Object<string, string>} */
			const placeholderMap = {};
			const embeddedCode = _tokens.map((token) => {
				if (typeof token === 'string') {
					return token;
				} else {
					const interpolationExpression = token.content;

					let placeholder;
					while (code.indexOf(placeholder = getPlaceholder(placeholderCounter++, language)) !== -1) { /* noop */ }
					placeholderMap[placeholder] = interpolationExpression;
					return placeholder;
				}
			}).join('');


			// 2. Tokenize the embedded code

			const embeddedTokens = tokenizeWithHooks(embeddedCode, grammar, language);


			// 3. Re-insert the interpolation

			const placeholders = Object.keys(placeholderMap);
			placeholderCounter = 0;

			/**
			 *
			 * @param {(Token|string)[]} tokens
			 * @returns {void}
			 */
			function walkTokens(tokens) {
				for (let i = 0; i < tokens.length; i++) {
					if (placeholderCounter >= placeholders.length) {
						return;
					}

					const token = tokens[i];

					if (typeof token === 'string' || typeof token.content === 'string') {
						const placeholder = placeholders[placeholderCounter];
						const s = typeof token === 'string' ? token : /** @type {string} */ (token.content);

						const index = s.indexOf(placeholder);
						if (index !== -1) {
							++placeholderCounter;

							const before = s.substring(0, index);
							const middle = tokenizeInterpolationExpression(placeholderMap[placeholder]);
							const after = s.substring(index + placeholder.length);

							const replacement = [];
							if (before) {
								replacement.push(before);
							}
							replacement.push(middle);
							if (after) {
								const afterTokens = [after];
								walkTokens(afterTokens);
								replacement.push(...afterTokens);
							}

							if (typeof token === 'string') {
								tokens.splice(i, 1, ...replacement);
								i += replacement.length - 1;
							} else {
								token.content = replacement;
							}
						}
					} else {
						const content = token.content;
						if (Array.isArray(content)) {
							walkTokens(content);
						} else {
							walkTokens([content]);
						}
					}
				}
			}
			walkTokens(embeddedTokens);

			return new Prism.Token(language, embeddedTokens, 'language-' + language, code);
		}

		/**
		 * The languages for which JS templating will handle tagged template literals.
		 *
		 * JS templating isn't active for only JavaScript but also related languages like TypeScript, JSX, and TSX.
		 */
		const supportedLanguages = {
			'javascript': true,
			'js': true,
			'typescript': true,
			'ts': true,
			'jsx': true,
			'tsx': true,
		};
		Prism.hooks.add('after-tokenize', (env) => {
			if (!(env.language in supportedLanguages)) {
				return;
			}

			/**
			 * Finds and tokenizes all template strings with an embedded languages.
			 *
			 * @param {(Token | string)[]} tokens
			 * @returns {void}
			 */
			function findTemplateStrings(tokens) {
				for (let i = 0, l = tokens.length; i < l; i++) {
					const token = tokens[i];

					if (typeof token === 'string') {
						continue;
					}

					const content = token.content;
					if (!Array.isArray(content)) {
						if (typeof content !== 'string') {
							findTemplateStrings([content]);
						}
						continue;
					}

					if (token.type === 'template-string') {
						/**
						 * A JavaScript template-string token will look like this:
						 *
						 * ["template-string", [
						 *     ["template-punctuation", "`"],
						 *     (
						 *         An array of "string" and "interpolation" tokens. This is the simple string case.
						 *         or
						 *         ["embedded-code", "..."] This is the token containing the embedded code.
						 *                                  It also has an alias which is the language of the embedded code.
						 *     ),
						 *     ["template-punctuation", "`"]
						 * ]]
						 */

						const embedded = content[1];
						if (content.length === 3 && typeof embedded !== 'string' && embedded.type === 'embedded-code') {
							// get string content
							const code = stringContent(embedded);

							const alias = embedded.alias;
							const language = Array.isArray(alias) ? alias[0] : alias;

							const grammar = Prism.languages[language];
							if (!grammar) {
								// the embedded language isn't registered.
								continue;
							}

							content[1] = tokenizeEmbedded(code, grammar, language);
						}
					} else {
						findTemplateStrings(content);
					}
				}
			}

			findTemplateStrings(env.tokens);
		});


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
	}
});
