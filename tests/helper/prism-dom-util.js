const { assert } = require('chai');
const PrismLoader = require('./prism-loader');

/**
 * @typedef {import("./prism-loader").PrismDOM} PrismDOM
 */

module.exports = {
	/**
	 * @param {PrismDOM} dom
	 */
	createUtil(dom) {
		const { Prism, document } = dom.window;

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
	 * Creates a new Prism DOM that is automatically cleaned up.
	 *
	 * @param {Options} param0
	 * @returns {Promise<void>}
	 *
	 * @typedef Options
	 * @property {string | string[]} [languages]
	 * @property {string | string[]} [plugins]
	 * @property {(dom: PrismDOM) => Promise<unknown>} use
	 */
	async usePrismDom({ languages, plugins, use }) {
		const dom = PrismLoader.createPrismDOM();

		if (languages) {
			dom.loadLanguages(languages);
		}
		if (plugins) {
			dom.loadPlugins(plugins);
		}

		try {
			await use(dom);

			dom.window.close();
		} catch (e) {
			dom.window.close();

			throw e;
		}
	}
};
