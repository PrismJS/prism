import { assert } from 'chai';
import { knownTitles } from '../../../src/shared/meta/title-data';
import { createTestSuite } from '../../helper/prism-dom-util';
import type { PrismDOM } from '../../helper/prism-loader';


describe('Show language', () => {
	const { it } = createTestSuite({
		languages: ['markup', 'javascript'],
		plugins: 'show-language'
	});

	const titles = (knownTitles as Record<string, string>);
	titles['js'] = 'JavaScript';
	titles['html'] = 'HTML';
	titles['svg'] = 'SVG';


	function test({ document, Prism }: PrismDOM<{}>, expectedLanguage: string, code: string) {
		document.body.innerHTML = code;
		Prism.highlightAll();

		assert.strictEqual(document.querySelector('.toolbar-item > span')?.textContent, expectedLanguage);
	}

	it('should work with component titles', (dom) => {
		// simple title
		test(dom, 'JavaScript', `<pre class="language-javascript"><code>foo</code></pre>`);
		test(dom, 'Markup', `<pre class="language-markup"><code>foo</code></pre>`);

		// aliases with the same title
		test(dom, 'JavaScript', `<pre class="language-js"><code>foo</code></pre>`);

		// aliases with a different title
		test(dom, 'HTML', `<pre class="language-html"><code>foo</code></pre>`);
		test(dom, 'SVG', `<pre class="language-svg"><code>foo</code></pre>`);
	});

	it('should work with custom titles', (dom) => {
		test(dom, 'Foo', `<pre class="language-javascript" data-language="Foo"><code>foo</code></pre>`);
	});

});
