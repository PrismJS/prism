import { createPrismDOM } from './prism-loader.js';
import { assertEqual, useSnapshot } from './snapshot.js';
import { formatHtml } from './util.js';

/**
 * @param {import('./prism-loader').PrismWindow<{}>} window
 *
 * @typedef AssertOptions
 * @property {string} [language]
 * @property {string} code
 * @property {boolean} [format]
 * @property {string | useSnapshot} [expected]
 */
export function createUtil(window) {
	const { Prism, document } = window;

	return {
		assert: {
			/**
			 * @param {AssertOptions} param0
			 */
			highlight({ language = 'none', code, format = true, expected = useSnapshot }) {
				let actual = Prism.highlight(code, language);
				if (format) {
					actual = formatHtml(actual);
				}
				assertEqual(actual, expected);
			},
			/**
			 * @param {AssertOptions} param0
			 */
			highlightElement({ language = 'none', code, format = true, expected = useSnapshot }) {
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
			/**
			 * @param {AssertOptions & { attributes?: Record<string, string> }} param0
			 */
			highlightPreElement({ language = 'none', attributes = {}, code, format = false, expected = useSnapshot }) {
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
			}
		},
	};
}

/**
 * @typedef {(
 *   import('./prism-loader').PrismDOM<{ plugins: Record<import('../../src/types').KebabToCamelCase<T>, {}> }>
 *   & { util: ReturnType<typeof createUtil> }
 * )} TestSuiteDom
 * @template {string} T
 */

/**
 * @param {{ languages?: string | string[]; plugins?: T | T[] }} options
 * @returns {{
 *   it: (title: string, fn: (dom: TestSuiteDom<T>) => void) => void
 * }}
 * @template {string} T
 */
export function createTestSuite(options) {
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
						fn(/** @type {any} */({ ...dom, util: createUtil(dom.window) }));
					});
				} finally {
					dom.window.close();
				}
			});
		}
	};
}
