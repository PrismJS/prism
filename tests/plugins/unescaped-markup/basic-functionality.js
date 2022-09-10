import { assert } from 'chai';
import { createTestSuite } from '../../helper/prism-dom-util.js';


describe('Show language', () => {
	const { it } = createTestSuite({
		languages: 'markup',
		plugins: 'unescaped-markup'
	});

	/**
	 * @param {import('../../helper/prism-loader').PrismDOM<{}>} dom
	 * @param {string} expectedText
	 * @param {string} code
	 */
	function test({ Prism, document }, expectedText, code) {
		document.body.innerHTML = code;
		Prism.highlightAll();

		assert.strictEqual(document.querySelector('code')?.textContent, expectedText);
	}

	it('should work with comments', (dom) => {
		test(dom, '\n<p>Example</p>\n', `<pre class="language-javascript"><code><!--
<p>Example</p>
--></code></pre>`);

		test(dom, '\n<p>Example 2</p>\n', `<pre><code class="language-javascript"><!--
<p>Example 2</p>
--></code></pre>`);
	});

	it('should work with script tags', (dom) => {
		test(dom, '<p>Example</p>', `<script class="language-javascript" type="text/plain"><p>Example</p></script>`);

		// inherit language
		test(dom, '<p>Example 2</p>', `<div class="language-javascript"><script type="text/plain"><p>Example 2</p></script></div>`);
	});

});
