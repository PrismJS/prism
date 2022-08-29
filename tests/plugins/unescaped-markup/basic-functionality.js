import { assert } from 'chai';
import { createScopedPrismDom } from '../../helper/prism-dom-util';


describe('Show language', async function () {
	const { Prism, document } = await createScopedPrismDom(this, {
		languages: 'markup',
		plugins: 'unescaped-markup'
	});


	/**
	 * @param {string} expectedText
	 * @param {string} code
	 */
	function test(expectedText, code) {
		document.body.innerHTML = code;
		Prism.highlightAll();

		assert.strictEqual(document.querySelector('code')?.textContent, expectedText);
	}

	it('should work with comments', () => {
		test('\n<p>Example</p>\n', `<pre class="language-javascript"><code><!--
<p>Example</p>
--></code></pre>`);

		test('\n<p>Example 2</p>\n', `<pre><code class="language-javascript"><!--
<p>Example 2</p>
--></code></pre>`);
	});

	it('should work with script tags', () => {
		test('<p>Example</p>', `<script class="language-javascript" type="text/plain"><p>Example</p></script>`);

		// inherit language
		test('<p>Example 2</p>', `<div class="language-javascript"><script type="text/plain"><p>Example 2</p></script></div>`);
	});

});
