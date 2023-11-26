import { Prism as PrismClass } from '../../../prism-core.js'
import { loader as JavaScriptLoader } from '../../../components/prism-javascript.js'
import { Plugin as ShowInvisiblesPlugin } from '../../../plugins/show-invisibles/prism-show-invisibles.js'
import { createUtil } from '../../helper/prism-dom-util.js';

describe('Show Invisibles', function () {
	const Prism = new PrismClass({ manual: false })
	JavaScriptLoader(Prism)
	ShowInvisiblesPlugin(Prism)
	window.Prism = Prism
	const util = createUtil(Prism);

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