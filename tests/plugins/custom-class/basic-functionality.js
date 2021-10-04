const { createUtil, createScopedPrismDom } = require('../../helper/prism-dom-util');


describe('Custom class', function () {
	const { Prism, window } = createScopedPrismDom(this, {
		languages: 'javascript',
		plugins: 'custom-class'
	});
	const util = createUtil(window);


	it('should set prefix', function () {
		Prism.plugins.customClass.prefix('prism-');

		util.assert.highlight({
			language: 'javascript',
			code: `var a = true;`,
			expected: `<span class="prism-token prism-keyword">var</span> a <span class="prism-token prism-operator">=</span> <span class="prism-token prism-boolean">true</span><span class="prism-token prism-punctuation">;</span>`
		});
	});

	it('should reset prefix', function () {
		Prism.plugins.customClass.prefix('');

		util.assert.highlight({
			language: 'javascript',
			code: `var a = true;`,
			expected: `<span class="token keyword">var</span> a <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>`
		});
	});

	it('should map class names using a function', function () {
		Prism.plugins.customClass.map(function (cls, language) {
			return `${language}-${cls}`;
		});

		util.assert.highlight({
			language: 'javascript',
			code: `var a = true;`,
			expected: `<span class="javascript-token javascript-keyword">var</span> a <span class="javascript-token javascript-operator">=</span> <span class="javascript-token javascript-boolean">true</span><span class="javascript-token javascript-punctuation">;</span>`
		});
	});

	it('should map class names using an object', function () {
		Prism.plugins.customClass.map({
			boolean: 'b',
			keyword: 'kw',
			operator: 'op',
			punctuation: 'p'
		});

		util.assert.highlight({
			language: 'javascript',
			code: `var a = true;`,
			expected: `<span class="token kw">var</span> a <span class="token op">=</span> <span class="token b">true</span><span class="token p">;</span>`
		});
	});

	it('should reset map', function () {
		Prism.plugins.customClass.map({});

		util.assert.highlight({
			language: 'javascript',
			code: `var a = true;`,
			expected: `<span class="token keyword">var</span> a <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>`
		});
	});

});
