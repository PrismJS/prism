import { assert } from 'chai';
import { createTestSuite } from '../../helper/prism-dom-util';


class DummyClipboard {
	text = '';
	readText() {
		return Promise.resolve(this.text);
	}
	writeText(data: string) {
		this.text = data;
		return Promise.resolve();
	}

	assign(navigator: Navigator) {
		(navigator as unknown as Record<string, unknown>).clipboard = this;
	}
}

describe('Copy to Clipboard', () => {
	const { it } = createTestSuite({
		languages: 'javascript',
		plugins: 'copy-to-clipboard',
	});


	it('should work', ({ Prism, window, document }) => {
		const clipboard = new DummyClipboard();
		clipboard.assign(window.navigator);

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
		clipboard.assign(window.navigator);

		document.body.innerHTML = `<pre class="language-none"><code>foo</code></pre>`;
		Prism.highlightAll();

		const button = document.querySelector('button');
		if (!button) {
			assert.fail('Expected button to be non-null');
		}

		button.click();

		assert.strictEqual(clipboard.text, 'foo');

		// change text
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		document.querySelector('code')!.textContent = 'bar';
		// and click
		button.click();

		assert.strictEqual(clipboard.text, 'bar');

		// change text
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		document.querySelector('code')!.textContent = 'baz';
		Prism.highlightAll();
		// and click
		button.click();

		assert.strictEqual(clipboard.text, 'baz');
	});

});
