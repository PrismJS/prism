const { UseSnapshot, assertEqual } = require('./snapshot');
const PrismLoader = require('./prism-loader');

/**
 * @typedef {import("./prism-loader").PrismDOM} PrismDOM
 * @typedef {import("./prism-loader").PrismWindow} PrismWindow
 */

module.exports = {
	/**
	 * @param {PrismWindow} window
	 */
	createUtil(window) {
		const { Prism, document } = window;

		const util = {
			assert: {
				/**
				 * @param {{
				 *   language?: string,
				 *   code: string,
				 *   expected?: string | typeof UseSnapshot
				 * }} param0
				 */
				highlight({ language = 'none', code, expected = UseSnapshot }) {
					assertEqual(Prism.highlight(code, Prism.languages[language], language), expected);
				},
				/**
				 * @param {{
				 *   language?: string,
				 *   code: string,
				 *   expected?: string | typeof UseSnapshot
				 * }} param0
				 */
				highlightElement({ language = 'none', code, expected = UseSnapshot }) {
					const element = document.createElement('CODE');
					element.classList.add('language-' + language);
					element.textContent = code;

					Prism.highlightElement(element);

					assertEqual(element.innerHTML, expected);
				},
				/**
				 * @param {{
				 *   language?: string,
				 *   attributes?: Record<string, string>,
				 *   code: string,
				 *   expected?: string | typeof UseSnapshot
				 * }} param0
				 */
				highlightPreElement({ language = 'none', attributes = {}, code, expected = UseSnapshot }) {
					const preElement = document.createElement('PRE');
					for (const key in attributes) {
						const value = attributes[key];
						preElement.setAttribute(key, value);
					}
					preElement.classList.add('language-' + language);

					const codeElement = document.createElement('CODE');
					codeElement.textContent = code;
					preElement.appendChild(codeElement);

					Prism.highlightElement(codeElement);

					assertEqual(preElement.outerHTML, expected);
				}
			},
		};

		return util;
	},

	/**
	 * Creates a Prism DOM instance that will be automatically cleaned up after the given test suite finished.
	 *
	 * @param {ReturnType<typeof import('mocha')["suite"]>} suite
	 * @param {Partial<Record<"languages" | "plugins", string | string[]>>} options
	 */
	createScopedPrismDom(suite, options = {}) {
		const dom = PrismLoader.createPrismDOM();

		suite.afterAll(function () {
			dom.window.close();
		});

		if (options.languages) {
			dom.loadLanguages(options.languages);
		}
		if (options.plugins) {
			dom.loadPlugins(options.plugins);
		}

		return dom;
	}
};
