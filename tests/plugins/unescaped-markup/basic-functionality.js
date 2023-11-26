import { assert } from '@esm-bundle/chai'
import { Prism as PrismClass } from '../../../prism-core.js'
import { loader as MarkupLoader } from '../../../components/prism-markup.js'
import { Plugin as UnescapedMarkupPlugin } from '../../../plugins/unescaped-markup/prism-unescaped-markup.js'

describe('Show language', function () {
	const Prism = new PrismClass({ manual: false })
	MarkupLoader(Prism)
	UnescapedMarkupPlugin(Prism)
	window.Prism = Prism

	function test(expectedText, code) {
		document.body.innerHTML = code;
		Prism.highlightAll();

		assert.strictEqual(document.querySelector('code').textContent, expectedText);
	}

	it('should work with comments', function () {
		test('\n<p>Example</p>\n', `<pre class="language-javascript"><code><!--
<p>Example</p>
--></code></pre>`);

		test('\n<p>Example 2</p>\n', `<pre><code class="language-javascript"><!--
<p>Example 2</p>
--></code></pre>`);
	});

	it('should work with script tags', function () {
		test('<p>Example</p>', `<script class="language-javascript" type="text/plain"><p>Example</p></script>`);

		// inherit language
		test('<p>Example 2</p>', `<div class="language-javascript"><script type="text/plain"><p>Example 2</p></script></div>`);
	});

});