const dom = require('../../helper/prism-loader').createPrismDOM();
const util = require('../../helper/prism-dom-util').createUtil(dom);

dom.loadLanguages('javascript');
dom.loadPlugins('show-invisibles');


describe('Show Invisibles', function () {

	it('should show invisible characters', function () {
		util.assert.highlightElement({
			language: 'javascript',
			code: `  	\n\r\n		`,
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

after(() => {
	dom.window.close();
});
