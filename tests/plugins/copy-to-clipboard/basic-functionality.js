import { assert } from '@esm-bundle/chai';
import { Prism as PrismClass } from '../../../prism-core.js'
import { loader as JavaScriptLoader } from '../../../components/prism-javascript.js'
import { Plugin as CopyToClipboardPlugin } from '../../../plugins/copy-to-clipboard/prism-copy-to-clipboard.js'

describe('Copy to Clipboard', function () {
	const Prism = new PrismClass({ manual: false })
	JavaScriptLoader(Prism)
	CopyToClipboardPlugin(Prism)
	window.Prism = Prism
	const clipboard = window.navigator.clipboard

	it('should work', async () => {

		document.body.innerHTML = `<pre class="language-none"><code>foo</code></pre>`;

		Prism.highlightAll();

		const button = document.querySelector('button');
		assert.notStrictEqual(button, null);

		button.click();

		assert.strictEqual(await clipboard.readText(), 'foo');
	});

	it('should copy the current text even after the code block changes its text', async () => {
		document.body.innerHTML = `<pre class="language-none"><code>foo</code></pre>`;
		Prism.highlightAll();

		const button = document.querySelector('button');
		assert.notStrictEqual(button, null);

		button.click();

		assert.strictEqual(await clipboard.readText(), 'foo');

		// change text
		document.querySelector('code').textContent = 'bar';
		// and click
		button.click();

		assert.strictEqual(await clipboard.readText(), 'bar');

		// change text
		document.querySelector('code').textContent = 'baz';
		Prism.highlightAll();
		// and click
		button.click();

		assert.strictEqual(await clipboard.readText(), 'baz');
	});

});