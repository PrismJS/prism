import { assert } from 'chai';
import { createTestSuite } from '../../helper/prism-dom-util.js';


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

describe('Copy to Clipboard', () => {
	const { it } = createTestSuite({
		languages: 'javascript',
		plugins: 'copy-to-clipboard',
	});


	it('should work', ({ Prism, window, document }) => {
		const clipboard = new DummyClipboard();
		// @ts-ignore
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

	it('should copy the current text even after the code block changes its text', ({ Prism, window, document }) => {
		const clipboard = new DummyClipboard();
		// @ts-ignore
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
		// @ts-ignore
		document.querySelector('code').textContent = 'bar';
		// and click
		button.click();

		assert.strictEqual(clipboard.text, 'bar');

		// change text
		// @ts-ignore
		document.querySelector('code').textContent = 'baz';
		Prism.highlightAll();
		// and click
		button.click();

		assert.strictEqual(clipboard.text, 'baz');
	});

});
