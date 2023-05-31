import { createTestSuite } from '../../helper/prism-dom-util';

describe('Autolinker', () => {
	const { it } = createTestSuite({
		languages: ['javascript', 'markup', 'css'],
		plugins: 'autolinker',
	});


	it('In JS code', ({ util }) => {
		util.assert.highlightElement({
			language: 'javascript',
			code: String.raw`
/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 * Reach Lea at fake@email.com (no, not really)
 * And this is [a Markdown link](http://prismjs.com). Sweet, huh?
 */
var foo = 5;
// And a single line comment http://google.com
`
		});
	});
	it('In CSS code', ({ util }) => {
		util.assert.highlightElement({
			language: 'css',
			code: String.raw`
@font-face {
	src: url(http://lea.verou.me/logo.otf);
	font-family: 'LeaVerou';
}
`
		});
	});
	it('In HTML code', ({ util }) => {
		util.assert.highlightElement({
			language: 'html',
			code: String.raw`
<!-- Links in HTML, woo!
Lea Verou http://lea.verou.me or, with Markdown, [Lea Verou](http://lea.verou.me) -->
<img src="https://prismjs.com/assets/img/spectrum.png" alt="In attributes too!" />
<p>Autolinking in raw text: http://prismjs.com</p>
`
		});
	});
});
