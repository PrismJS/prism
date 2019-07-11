const { assert } = require('chai');


module.exports = {
	/**
	 *
	 * @param {import("./prism-loader").PrismDOM} dom
	 */
	createUtil(dom) {
		const { Prism, document } = dom.window;

		const util = {

			assert: {

				highlight({ language, code, expected }) {
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
	}
}
