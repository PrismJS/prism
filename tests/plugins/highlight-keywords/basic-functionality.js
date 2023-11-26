import { Prism as PrismClass } from '../../../prism-core.js'
import { loader as JavaScriptLoader } from '../../../components/prism-javascript.js'
import { Plugin as HighlightKeywordsPlugin } from '../../../plugins/highlight-keywords/prism-highlight-keywords.js'
import { createUtil } from '../../helper/prism-dom-util.js';

describe('Highlight Keywords', function () {
	const Prism = new PrismClass({ manual: false })
	JavaScriptLoader(Prism)
	HighlightKeywordsPlugin(Prism)
	window.Prism = Prism
	const util = createUtil(Prism);

	it('should highlight keywords', function () {
		util.assert.highlightElement({
			language: 'javascript',
			code: `import * from ''; const foo;`,
			expected: `<span class="token keyword keyword-import">import</span> <span class="token operator">*</span> <span class="token keyword keyword-from">from</span> <span class="token string">''</span><span class="token punctuation">;</span> <span class="token keyword keyword-const">const</span> foo<span class="token punctuation">;</span>`
		});
	});

});