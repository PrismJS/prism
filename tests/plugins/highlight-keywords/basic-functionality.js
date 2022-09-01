import { createTestSuite } from '../../helper/prism-dom-util';


describe('Highlight Keywords', () => {
	const { it } = createTestSuite({
		languages: 'javascript',
		plugins: 'highlight-keywords'
	});

	it('should highlight keywords', ({ util }) => {
		util.assert.highlightElement({
			language: 'javascript',
			code: `import * from ''; const foo;`,
			expected: `<span class="token keyword keyword-import">import</span> <span class="token operator">*</span> <span class="token keyword keyword-from">from</span> <span class="token string">''</span><span class="token punctuation">;</span> <span class="token keyword keyword-const">const</span> foo<span class="token punctuation">;</span>`
		});
	});

});
