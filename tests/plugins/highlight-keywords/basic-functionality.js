const { createUtil, createScopedPrismDom } = require('../../helper/prism-dom-util');


describe('Highlight Keywords', function () {
	const { window } = createScopedPrismDom(this, {
		languages: 'javascript',
		plugins: 'highlight-keywords'
	});
	const util = createUtil(window);


	it('should highlight keywords', function () {
		util.assert.highlightElement({
			language: 'javascript',
			code: `import * from '';\nconst foo;`
		});
	});

});
