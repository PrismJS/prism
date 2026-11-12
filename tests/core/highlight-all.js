import { assert } from 'chai';
import { createTestSuite } from '../helper/prism-dom-util.js';

describe('highlightAll', () => {
	const { it } = createTestSuite({});

	it('should highlight the other elements when one grammar throws', ({ document, Prism }) => {
		const errors = [];
		Prism.config.errorHandler = error => errors.push(error.message);
		Prism.languageRegistry.add({
			id: 'broken',
			grammar: {
				$tokenize () {
					throw new Error('broken grammar');
				},
			},
		});
		Prism.languageRegistry.add({ id: 'fine', grammar: { keyword: /\bfoo\b/ } });

		document.body.innerHTML = `<code class="language-broken">foo</code><code class="language-fine">foo</code>`;
		Prism.highlightAll();

		assert.strictEqual(
			document.querySelector('.language-fine')?.innerHTML,
			'<span class="token keyword">foo</span>'
		);
		assert.deepStrictEqual(errors, ['broken grammar']);
	});

	// https://github.com/PrismJS/prism/issues/3364
	it('should only highlight elements with a whole language class', ({ document, Prism }) => {
		Prism.languageRegistry.add({ id: 'fine', grammar: { keyword: /\bfoo\b/ } });
		const ignored = `<code class="copy-language-fine">foo</code><div class="golang-fine"><code>foo</code></div>`;

		document.body.innerHTML = `<code class="x language-fine">foo</code><code class="x\n\tlanguage-fine">foo</code><div class="lang-fine"><code>foo</code></div>${ignored}`;
		Prism.highlightAll();

		assert.strictEqual(document.querySelectorAll('.token').length, 3);
		assert.isTrue(document.body.innerHTML.endsWith(ignored));
	});
});
