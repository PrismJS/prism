import { createPrismDOM } from './prism-loader.js';
import { assertEqual, useSnapshot } from './snapshot.js';
import { formatHtml } from './util.js';

/**
 * @param {PrismWindow} window
 */
export function createUtil (window) {
	const { Prism, document } = window;

	return {
		assert: {
			highlight ({ language = 'none', code, format = true, expected = useSnapshot }) {
				let actual = Prism.highlight(code, language);
				if (format) {
					actual = formatHtml(actual);
				}
				assertEqual(actual, expected);
			},
			highlightElement ({ language = 'none', code, format = true, expected = useSnapshot }) {
				const element = document.createElement('code');
				element.classList.add('language-' + language);
				element.textContent = code;

				Prism.highlightElement(element);

				let actual = element.innerHTML;
				if (format) {
					actual = formatHtml(actual);
				}
				assertEqual(actual, expected);
			},
			highlightPreElement ({
				language = 'none',
				attributes = {},
				code,
				format = false,
				expected = useSnapshot,
			}) {
				const preElement = document.createElement('pre');
				for (const key in attributes) {
					const value = attributes[key];
					preElement.setAttribute(key, value);
				}
				preElement.classList.add('language-' + language);

				const codeElement = document.createElement('code');
				codeElement.textContent = code;
				preElement.appendChild(codeElement);

				Prism.highlightElement(codeElement);

				let actual = preElement.outerHTML;
				if (format) {
					actual = formatHtml(actual);
				}
				assertEqual(actual, expected);
			},
		},
	};
}

/**
 * @template T
 * @param {object} options
 * @param {string | string[]} [options.languages]
 * @param {T | T[]} [options.plugins]
 * @returns {TestSuite}
 */
export function createTestSuite (options) {
	return {
		it: (title, fn) => {
			it(title, async () => {
				const dom = createPrismDOM();

				try {
					if (options.languages) {
						await dom.loadLanguages(options.languages);
					}
					if (options.plugins) {
						await dom.loadPlugins(options.plugins);
					}

					dom.withGlobals(() => {
						fn({ ...dom, util: createUtil(dom.window) });
					});
				}
				finally {
					dom.window.close();
				}
			});
		},
	};
}

/**
 * @typedef {object} AssertOptions
 * @property {string} [language]
 * @property {string} code
 * @property {boolean} [format]
 * @property {string | useSnapshot} [expected]
 */

/**
 * @typedef {object} TestSuiteDom
 * @property {object} plugins
 * @property {object} util
 */

/**
 * @callback TestFunction
 * @param {TestSuiteDom} dom
 * @returns {void}
 */

/**
 * @callback ItFunction
 * @param {string} title
 * @param {TestFunction} fn
 * @returns {void}
 */

/**
 * @typedef {object} TestSuite
 * @property {ItFunction} it
 */

/** @typedef {import('./prism-loader.js').PrismWindow} PrismWindow */
