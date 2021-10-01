const { assert } = require('chai');
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
				highlight({ language = 'none', code, expected }) {
					assert.strictEqual(Prism.highlight(code, Prism.languages[language], language), expected);
				},
				highlightElement({ language = 'none', code, expected }) {
					const element = document.createElement('CODE');
					element.classList.add('language-' + language);
					element.textContent = code;

					Prism.highlightElement(element);

					assert.strictEqual(element.innerHTML, expected);
				}
			},
		};

		return util;
	},

	/**
	 * @param {ReturnType<typeof import('mocha')["suite"]>} suite
	 * @param {Partial<Record<"languages" | "plugins", string | string[]>>} options
	 */
	reusablePrismDom(suite, options = {}) {
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
