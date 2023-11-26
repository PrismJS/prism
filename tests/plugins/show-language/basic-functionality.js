import { assert } from "@esm-bundle/chai"
import { Prism as PrismClass } from '../../../prism-core.js'
import { loader as MarkupLoader } from '../../../components/prism-javascript.js'
import { loader as JavaScriptLoader } from '../../../components/prism-javascript.js'
import { Plugin as ShowLanguagePlugin } from '../../../plugins/show-language/prism-show-language.js'

describe('Show language', function () {
	const Prism = new PrismClass({ manual: false })
	MarkupLoader(Prism)
	JavaScriptLoader(Prism)
	ShowLanguagePlugin(Prism)
	window.Prism = Prism

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