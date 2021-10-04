const { assert } = require('chai');
const { createScopedPrismDom } = require('../../helper/prism-dom-util');


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

describe('Copy to Clipboard', function () {
	const { Prism, document, window } = createScopedPrismDom(this, {
		languages: 'javascript',
		plugins: 'copy-to-clipboard',
	});


	it('should work', function () {
		const clipboard = new DummyClipboard();
		window.navigator.clipboard = clipboard;

		document.body.innerHTML = `<pre class="language-none"><code>foo</code></pre>`;
		Prism.highlightAll();

		const button = document.querySelector('button');
		assert.notStrictEqual(button, null);

		button.click();

		assert.strictEqual(clipboard.text, 'foo');
	});

	it('should copy the current text even after the code block changes its text', function () {
		const clipboard = new DummyClipboard();
		window.navigator.clipboard = clipboard;

		document.body.innerHTML = `<pre class="language-none"><code>foo</code></pre>`;
		Prism.highlightAll();

		const button = document.querySelector('button');
		assert.notStrictEqual(button, null);

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
