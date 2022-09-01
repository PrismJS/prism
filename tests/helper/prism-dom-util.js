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
 * Creates a Prism DOM instance that will be automatically cleaned up after the given test suite finished.
 *
 * @param {ReturnType<typeof import('mocha')["suite"]>} suite
 * @param {{ languages?: string | string[]; plugins?: T | T[] }} options
 * @returns {Promise<import('./prism-loader').PrismDOM<{ plugins: Record<import('../../src/types').KebabToCamelCase<T>, {}> }>>}
 * @template {string} T
 */
export async function createScopedPrismDom(suite, options = {}) {
	const dom = createPrismDOM();

	suite.afterAll(() => {
		dom.window.close();
	});

	if (options.languages) {
		await dom.loadLanguages(options.languages);
	}
	if (options.plugins) {
		await dom.loadPlugins(options.plugins);
	}

	return /** @type {any} */ (dom);
}
