import { createTestSuite } from '../../helper/prism-dom-util';


describe('Show Invisibles', () => {
	const { it } = createTestSuite({
		languages: 'javascript',
		plugins: 'show-invisibles'
	});

	it('should show invisible characters', ({ util }) => {
		util.assert.highlightElement({
			language: 'javascript',
			code: `  \t\n\r\n\t\t`,
			expected: `<span class="token space"> </span><span class="token space"> </span><span class="token tab">\t</span><span class="token lf">\n</span><span class="token crlf">\n</span><span class="token tab">\t</span><span class="token tab">\t</span>`
		});
	});

	it('should show invisible characters inside tokens', ({ util }) => {
		util.assert.highlightElement({
			language: 'javascript',
			code: `/* \n */`,
			expected: `<span class="token comment">/*<span class="token space"> </span><span class="token lf">\n</span><span class="token space"> </span>*/</span>`
		});
	});
});
