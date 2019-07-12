const { assert } = require('chai');

const dom = require('../../helper/prism-loader').createPrismDOM();

const { Prism, document } = dom.window;

// A very simple class pretending to by ClipboardJS v2.
// This is our "virtual clipboard".
let ClipboardText = null;
let ClipboardCopyWillSucceed = true;
dom.window.ClipboardJS = class {
	/**
	 *
	 * @param {Element} element
	 * @param {Object} options
	 * @param {() => string} options.text
	 */
	constructor(element, options) {
		this.element = element;
		this.options = options;
		element.addEventListener('click', () => this.fire());
		this.onSuccess = [];
		this.onError = [];
	}

	on(event, callback) {
		switch (event) {
			case 'success':
				this.onSuccess.push(callback);
				break;
			case 'error':
				this.onError.push(callback);
				break;

			default:
				throw new Error(`Unknown event. Please fix this make-believe.`);
		}
	}

	fire() {
		if (ClipboardCopyWillSucceed) {
			ClipboardText = this.options.text();
			this.onSuccess.forEach(c => c());
		} else {
			this.onError.forEach(c => c());
		}
	}
};

dom.loadLanguages('javascript');
dom.loadPlugins('copy-to-clipboard');


describe('Copy to Clipboard', function () {

	it('should work', function () {
		document.body.innerHTML = `<pre class="language-none"><code>foo</code></pre>`;
		Prism.highlightAll();

		const button = document.querySelector('button');
		assert.notStrictEqual(button, null);

		ClipboardText = null;
		ClipboardCopyWillSucceed = true;
		button.click();

		assert.strictEqual(ClipboardText, 'foo');
	});

	it('should copy the current text even after the code block changes its text', function () {
		document.body.innerHTML = `<pre class="language-none"><code>foo</code></pre>`;
		Prism.highlightAll();

		const button = document.querySelector('button');
		assert.notStrictEqual(button, null);

		ClipboardText = null;
		ClipboardCopyWillSucceed = true;
		button.click();

		assert.strictEqual(ClipboardText, 'foo');

		// change text
		document.querySelector('code').textContent = "bar";
		// and click
		button.click();

		assert.strictEqual(ClipboardText, 'bar');

		// change text
		document.querySelector('code').textContent = "baz";
		Prism.highlightAll();
		// and click
		button.click();

		assert.strictEqual(ClipboardText, 'baz');
	});

});

after(() => {
	dom.window.close();
});
