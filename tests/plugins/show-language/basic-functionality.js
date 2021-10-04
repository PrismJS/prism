const { assert } = require('chai');
const { createScopedPrismDom } = require('../../helper/prism-dom-util');


describe('Show language', function () {
	const { Prism, document } = createScopedPrismDom(this, {
		languages: ['markup', 'javascript'],
		plugins: 'show-language'
	});


	function test(expectedLanguage, code) {
		document.body.innerHTML = code;
		Prism.highlightAll();

		assert.strictEqual(document.querySelector('.toolbar-item > span').textContent, expectedLanguage);
	}

	it('should work with component titles', function () {
		// simple title
		test('JavaScript', `<pre class="language-javascript"><code>foo</code></pre>`);
		test('Markup', `<pre class="language-markup"><code>foo</code></pre>`);

		// aliases with the same title
		test('JavaScript', `<pre class="language-js"><code>foo</code></pre>`);

		// aliases with a different title
		test('HTML', `<pre class="language-html"><code>foo</code></pre>`);
		test('SVG', `<pre class="language-svg"><code>foo</code></pre>`);
	});

	it('should work with custom titles', function () {
		test('Foo', `<pre class="language-javascript" data-language="Foo"><code>foo</code></pre>`);
	});

});
