import { assert } from 'chai';
import { createPrismDOM } from '../../helper/prism-loader.js';

describe('Filter highlightAll', () => {
	/**
	 * Returns the ids of the code elements that `highlightAll` highlights on a page with the given settings.
	 *
	 * @param {string} settings The HTML of the elements that carry the plugin's `data-*` attributes
	 */
	async function highlighted (settings) {
		const { Prism, document, window, loadLanguages, loadPlugins, withGlobals } =
			createPrismDOM();
		await loadLanguages('javascript');

		document.head.innerHTML = settings;
		document.body.innerHTML = `
			<pre><code id="plain" class="language-javascript">let a = 1;</code></pre>
			<pre><code id="skip" class="language-javascript skip">let b = 2;</code></pre>
			<pre><code id="unknown" class="language-unknown">c</code></pre>`;
		await loadPlugins('filter-highlight-all');

		/** @type {string[]} */
		let ids = [];
		Prism.hooks.add('before-all-elements-highlight', env => {
			ids = env.elements.map(element => element.id);
		});
		withGlobals(() => Prism.highlightAll());

		window.close();
		return ids;
	}

	// Module scripts, so `document.currentScript` is null while the plugin reads its settings

	it('should highlight only the elements that data-filter-selector matches', async () => {
		const ids = await highlighted(
			'<script type="module" src="filter-highlight-all.js" data-filter-selector="code.skip"></script>'
		);

		assert.deepEqual(ids, ['skip']);
	});

	it('should skip the elements with an unknown language when data-filter-known is set', async () => {
		const ids = await highlighted(
			'<script type="module" src="filter-highlight-all.js" data-filter-known></script>'
		);

		assert.deepEqual(ids, ['plain', 'skip']);
	});

	it('should ignore data-reject-selector on an element other than a script', async () => {
		const ids = await highlighted('<meta data-reject-selector="code.skip">');

		assert.deepEqual(ids, ['plain', 'skip', 'unknown']);
	});

	it('should fall back to data-prism-reject-selector on any element', async () => {
		const ids = await highlighted('<meta data-prism-reject-selector="code.skip">');

		assert.deepEqual(ids, ['plain', 'unknown']);
	});

	it('should prefer the attributes of the script over data-prism-*', async () => {
		const ids = await highlighted(`
			<meta data-prism-reject-selector="#plain">
			<script type="module" src="filter-highlight-all.js" data-reject-selector="code.skip"></script>`);

		assert.deepEqual(ids, ['plain', 'unknown']);
	});
});
