import { assert } from 'chai';
import { createTestSuite } from '../../helper/prism-dom-util.js';

describe('Keep Markup', () => {
	const { it } = createTestSuite({
		languages: ['javascript', 'css'],
		plugins: 'keep-markup',
	});

	/**
	 *
	 * @param {PrismDOM<{}>} dom
	 * @param {string} html
	 * @param {string} [language='none']
	 * @returns {string}
	 */
	function highlightInElement ({ Prism, document }, html, language = 'none') {
		const pre = document.createElement('pre');
		pre.className = `language-${language}`;
		pre.innerHTML = `<code>${html}</code>`;
		const code = pre.children[0];

		Prism.highlightElement(code);

		return code.innerHTML;
	}

	/**
	 *
	 * @param {PrismDOM<{}>} dom
	 * @param {string} html
	 * @param {string} [language='none']
	 */
	function keepMarkup (dom, html, language = 'none') {
		assert.equal(highlightInElement(dom, html, language), html);
	}

	it('should keep <span> markup', dom => {
		keepMarkup(dom, `x<span>a</span>y`);
	});
	it('should preserve markup order', dom => {
		keepMarkup(dom, `x<a></a><b></b>y`);
	});

	it('should keep last markup', dom => {
		keepMarkup(dom, `xy<span>a</span>`);
		keepMarkup(dom, `xy<a>a</a>`);
	});

	// Empty markup as the last child is dropped without an end-of-content fallback
	// https://github.com/PrismJS/prism/issues/1618
	it('should keep last empty markup', dom => {
		keepMarkup(dom, `xy<span></span>`);
		keepMarkup(dom, `xy<span class="keep"></span>`);
		keepMarkup(dom, `xy<a></a>`);
	});
	it('should keep empty markup that is not last', dom => {
		keepMarkup(dom, `<span class="keep"></span>xy`);
		keepMarkup(dom, `<span class="keep"></span>p { color: red }<span class="keep"></span>`);
	});
	it('should preserve order of trailing empty markup', dom => {
		keepMarkup(dom, `xy<span class="first"></span><span class="second"></span>`);
	});
	it('should keep empty markup after last contentful markup', dom => {
		keepMarkup(dom, `<span>foo</span><span class="keep"></span>`);
	});

	it('should support double highlighting', ({ Prism, document }) => {
		const pre = document.createElement('pre');
		pre.className = 'language-javascript drop-tokens';
		pre.innerHTML = '<code>var <mark>a = 42</mark>;</code>';
		const code = pre.children[0];
		const initial = code.innerHTML;

		Prism.highlightElement(code);
		const firstPass = code.innerHTML;

		Prism.highlightElement(code);
		const secondPass = code.innerHTML;

		// check that we actually did some highlighting
		assert.notStrictEqual(initial, firstPass);
		// check that the highlighting persists
		assert.strictEqual(firstPass, secondPass);
	});

	it('should not clone markup nodes', ({ Prism, document }) => {
		const pre = document.createElement('pre');
		pre.className = 'language-javascript drop-tokens';
		pre.innerHTML = '<code>var <mark>a = <mark>42</mark></mark>;</code>';
		const code = pre.children[0];
		const firstNodeRefBefore = code.querySelector('mark');
		const secondNodeRefBefore = firstNodeRefBefore?.querySelector('mark');

		Prism.highlightElement(code);
		const firstNodeRefAfter = code.querySelector('mark');
		const secondNodeRefAfter = firstNodeRefAfter?.querySelector('mark');

		assert.strictEqual(firstNodeRefBefore, firstNodeRefAfter);
		assert.strictEqual(secondNodeRefBefore, secondNodeRefAfter);
	});

	it('should keep the #1618 last empty keep element', ({ Prism, document }) => {
		// Build the issue repro with DOM APIs so an empty <div> is actually
		// the last child of <code> (HTML parsing can hoist a block tag out).
		const pre = document.createElement('pre');
		pre.className = 'language-css';
		const code = document.createElement('code');
		const first = document.createElement('div');
		first.className = 'keep';
		const last = document.createElement('div');
		last.className = 'keep';
		code.append(first, document.createTextNode('p { color: red }'), last);
		pre.appendChild(code);

		assert.strictEqual(code.lastChild, last);
		assert.strictEqual(last.childNodes.length, 0);

		Prism.highlightElement(code);

		const keeps = code.querySelectorAll('div.keep');
		assert.equal(keeps.length, 2);
		assert.strictEqual(keeps[0], first);
		assert.strictEqual(keeps[1], last);
		assert.strictEqual(code.lastChild, last);
	});
});

/**
 * @template T
 * @typedef {import('../../types.d.ts').PrismDOM<T>} PrismDOM
 */
