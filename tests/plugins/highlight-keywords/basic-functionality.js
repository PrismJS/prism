const dom = require('../../helper/prism-loader').createPrismDOM();
const util = require('../../helper/prism-dom-util').createUtil(dom);

dom.loadLanguages('javascript');
dom.loadPlugins('highlight-keywords');


describe('Highlight Keywords', function () {

	it('should highlight keywords', function () {
		util.assert.highlightElement({
			language: 'javascript',
			code: `import * from ''; const foo;`,
			expected: `<span class="token keyword keyword-import">import</span> <span class="token operator">*</span> <span class="token keyword keyword-from">from</span> <span class="token string">''</span><span class="token punctuation">;</span> <span class="token keyword keyword-const">const</span> foo<span class="token punctuation">;</span>`
		});
	});

});

after(() => {
	dom.window.close();
});
