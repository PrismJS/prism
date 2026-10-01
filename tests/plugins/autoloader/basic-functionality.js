import { assert } from 'chai';
import { createPrismDOM } from '../../helper/prism-loader.js';

describe('Autoloader', () => {
	/**
	 * Highlights the code and waits until the Autoloader highlights it again.
	 *
	 * @param {string} language
	 * @param {string} code
	 */
	async function highlightAfterLoad (language, code) {
		const { Prism, document, window, loadLanguages, loadPlugins } = createPrismDOM();
		await loadLanguages(language);
		await loadPlugins('autoloader');
		Prism.pluginRegistry.peek('autoloader').plugin.srcPath = new URL(
			'../../../src/',
			import.meta.url
		).href;
		/** @type {string[]} */
		const errors = [];
		Prism.config.errorHandler = message => errors.push(message);

		const element = document.createElement('code');
		element.className = 'language-' + language;
		element.textContent = code;
		Prism.highlightElement(element);
		await new Promise(resolve => Prism.hooks.add('complete', resolve));
		// Let a repeated load of a failed language report before the caller asserts
		await new Promise(resolve => setTimeout(resolve));

		window.close();
		return { html: element.innerHTML, errors };
	}

	it('should load the language of code embedded in the element', async () => {
		const { html } = await highlightAfterLoad('markup', '<style>a { color: red; }</style>');

		assert.include(html, '<span class="token property">color</span>');
	});

	it('should load the other embedded languages when one fails, and report it once', async () => {
		const { html, errors } = await highlightAfterLoad(
			'markdown',
			'```bogus\nfoo\n```\n\n```css\na { color: red; }\n```'
		);

		assert.include(html, '<span class="token property">color</span>');
		assert.lengthOf(errors, 1);
	});
});
