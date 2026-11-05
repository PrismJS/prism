import assert from 'node:assert/strict';
import { createTestSuite } from '../../helper/prism-dom-util.js';

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

describe('Line Highlight', () => {
	const { it } = createTestSuite({
		languages: 'javascript',
		plugins: 'line-highlight',
	});

	it('single line', ({ util }) => {
		util.assert.highlightPreElement({
			language: 'none',
			code: exampleCode,
			attributes: { 'data-line': '2' },
		});
	});

	it('single range', ({ util }) => {
		util.assert.highlightPreElement({
			language: 'none',
			code: exampleCode,
			attributes: { 'data-line': '3-5' },
		});
	});

	it('multiple ranges', ({ util }) => {
		util.assert.highlightPreElement({
			language: 'none',
			code: exampleCode,
			attributes: { 'data-line': '1, 3-5, 8' },
		});
	});

	// Fixed by https://github.com/PrismJS/prism/pull/3518
	it('offset', ({ util }) => {
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
	});

	it('out of bounds ranges', ({ util }) => {
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

describe('Line Highlight with line numbers registered after', () => {
	const { it } = createTestSuite({
		languages: 'javascript',
		plugins: ['line-highlight', 'line-numbers'],
	});

	it('positions the highlight after line-numbers creates its rows', ({ Prism, document }) => {
		const pre = document.createElement('pre');
		pre.className = 'line-numbers';
		pre.setAttribute('data-line', '2');

		const code = document.createElement('code');
		code.className = 'language-none';
		code.textContent = 'a\nb\nc';
		pre.appendChild(code);

		Prism.highlightElement(code);

		const highlight = pre.querySelector('.line-highlight');
		assert.ok(highlight);
		assert.notStrictEqual(highlight.style.top, '');
		assert.notStrictEqual(highlight.style.height, '');
	});
});
