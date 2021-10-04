const { createUtil, createScopedPrismDom } = require('../../helper/prism-dom-util');


describe('Show Invisibles', function () {
	const { window } = createScopedPrismDom(this, {
		languages: 'javascript',
		plugins: 'show-invisibles'
	});
	const util = createUtil(window);


	it('should show invisible characters', function () {
		util.assert.highlightElement({
			language: 'javascript',
			code: `  \t\n\r\n\t\t`,
			expected: `<span class="token space"> </span><span class="token space"> </span><span class="token tab">\t</span><span class="token lf">\n</span><span class="token crlf">\n</span><span class="token tab">\t</span><span class="token tab">\t</span>`
		});
	});

	it('should show invisible characters inside tokens', function () {
		util.assert.highlightElement({
			language: 'javascript',
			code: `/* \n */`,
			expected: `<span class="token comment">/*<span class="token space"> </span><span class="token lf">\n</span><span class="token space"> </span>*/</span>`
		});
	});

});
