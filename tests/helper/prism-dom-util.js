import { assert } from 'chai';
import { createPrismDOM } from './prism-loader';

/**
 * @param {import('./prism-loader').PrismWindow<{}>} window
 */
export function createUtil(window) {
	const { Prism, document } = window;

	return {
		assert: {
			/**
			 * @param {{
			 *   language?: string;
			 *   code: string;
			 *   expected: string;
			 * }} param0
			 */
			highlight({ language = 'none', code, expected }) {
				assert.strictEqual(Prism.highlight(code, language), expected);
			},
			/**
			 * @param {{
			 *   language?: string;
			 *   code: string;
			 *   expected: string;
			 * }} param0
			 */
			highlightElement({ language = 'none', code, expected }) {
				const element = document.createElement('CODE');
				element.classList.add('language-' + language);
				element.textContent = code;

				Prism.highlightElement(element);

				assert.strictEqual(element.innerHTML, expected);
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
 *   it: (title: string, fn: (dom: TestSuiteDom<T>) => void | Promise<void>) => void
 * }}
 * @template {string} T
 */
export function createTestSuite(options) {
	return {
		it: async (title, fn) => {
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
