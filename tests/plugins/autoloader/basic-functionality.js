import { createUtil } from '../../helper/prism-dom-util.js';
import { createPrismDOM } from '../../helper/prism-loader.js';

describe('Autoloader', () => {
	it('should load the language of code embedded in the element', async () => {
		const { Prism, document, window, loadLanguages, loadPlugins } = createPrismDOM();
		await loadLanguages('markup');
		await loadPlugins('autoloader');
		Prism.pluginRegistry.peek('autoloader').plugin.srcPath = new URL(
			'../../../src/',
			import.meta.url
		).href;
		const code = '<style>a { color: red; }</style>';

		const element = document.createElement('code');
		element.className = 'language-markup';
		element.textContent = code;
		Prism.highlightElement(element);
		await new Promise(resolve => Prism.hooks.add('complete', resolve));

		createUtil(window).assert.highlightElement({ language: 'markup', code });
		window.close();
	});
});
