const { createUtil, createScopedPrismDom } = require('../../helper/prism-dom-util');

// just a few lines of JS code, so we have something to highlight
const exampleCode = String.raw`// foo

var foo = 0;
var bar = 1;
var baz = foo + bar;
function add(a, b) {
	return a + b;
}
const sub = (a, b) => a - b;
`;

describe('Line Highlight', function () {
	const { window } = createScopedPrismDom(this, {
		languages: 'javascript',
		plugins: 'line-highlight'
	});
	const util = createUtil(window);


	it('single line', function () {
		util.assert.highlightPreElement({
			language: 'none',
			code: exampleCode,
			attributes: { 'data-line': '2' },
		});
	});

	it('single range', function () {
		util.assert.highlightPreElement({
			language: 'none',
			code: exampleCode,
			attributes: { 'data-line': '3-5' },
		});
	});

	it('multiple ranges', function () {
		util.assert.highlightPreElement({
			language: 'none',
			code: exampleCode,
			attributes: { 'data-line': '1, 3-5, 8' },
		});
	});

	// Fixed by https://github.com/PrismJS/prism/pull/3518
	/*it('offset', function () {
		util.assert.highlightPreElement({
			language: 'none',
			code: exampleCode,
			attributes: { 'data-line': '42', 'data-line-offset': '40' },
		});
		util.assert.highlightPreElement({
			language: 'none',
			code: exampleCode,
			attributes: { 'data-line': '41, 43-45, 48', 'data-line-offset': '40' },
		});
	});*/

	it('out of bounds ranges', function () {
		util.assert.highlightPreElement({
			language: 'none',
			code: exampleCode,
			attributes: { 'data-line': '400' },
		});
		util.assert.highlightPreElement({
			language: 'none',
			code: exampleCode,
			attributes: { 'data-line': '4-400' },
		});
	});
});
