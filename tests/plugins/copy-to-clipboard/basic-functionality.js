import { assert } from 'chai';
import { createScopedPrismDom } from '../../helper/prism-dom-util';


class DummyClipboard {
	constructor() {
		this.text = '';
	}
	async readText() {
		return this.text;
	}
	/** @param {string} data */
	writeText(data) {
		this.text = data;
		return Promise.resolve();
	}
}

describe('Copy to Clipboard', async function () {
	const { Prism, document, window } = await createScopedPrismDom(this, {
		languages: 'javascript',
		plugins: 'copy-to-clipboard',
	});


	it('should work', () => {
		const clipboard = new DummyClipboard();
		window.navigator.clipboard = clipboard;

		document.body.innerHTML = `<pre class="language-none"><code>foo</code></pre>`;
		Prism.highlightAll();

		const button = document.querySelector('button');
		if (!button) {
			assert.fail('Expected button to be non-null');
		}

		button.click();

		assert.strictEqual(clipboard.text, 'foo');
	});

	it('should copy the current text even after the code block changes its text', () => {
		const clipboard = new DummyClipboard();
		window.navigator.clipboard = clipboard;

		document.body.innerHTML = `<pre class="language-none"><code>foo</code></pre>`;
		Prism.highlightAll();

		const button = document.querySelector('button');
		if (!button) {
			assert.fail('Expected button to be non-null');
		}

		button.click();

		assert.strictEqual(clipboard.text, 'foo');

		// change text
		document.querySelector('code').textContent = 'bar';
		// and click
		button.click();

		assert.strictEqual(clipboard.text, 'bar');

		// change text
		document.querySelector('code').textContent = 'baz';
		Prism.highlightAll();
		// and click
		button.click();

		assert.strictEqual(clipboard.text, 'baz');
	});

});
