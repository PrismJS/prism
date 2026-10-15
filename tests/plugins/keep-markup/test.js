import { assert } from 'chai';
import { createTestSuite } from '../../helper/prism-dom-util.js';

describe('Keep Markup', () => {
	const { it } = createTestSuite({
		languages: 'javascript',
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

	// Nested zero-length markup is flattened / dropped (#1640)
	// https://github.com/PrismJS/prism/issues/1640
	it('should keep nested zero-length markup', dom => {
		keepMarkup(dom, `<x><y></y></x>`);
		keepMarkup(dom, `<x>a<y></y></x>`);
		keepMarkup(dom, `<x>a<y></y><z></z></x>`);
		keepMarkup(dom, `<x>a<y><z></z></y></x>`);
	});
	it('should keep nested empty markup among sibling text', dom => {
		keepMarkup(dom, `<x>a<y></y>b</x>`);
		keepMarkup(dom, `<x><y></y></x>foo`);
		keepMarkup(dom, `<x>a<y></y></x>b`);
	});
	it('should preserve nested empty markup parents', ({ Prism, document }) => {
		const pre = document.createElement('pre');
		pre.className = 'language-none';
		pre.innerHTML = '<code><x>a<y></y></x>b</code>';
		const code = pre.children[0];
		const xBefore = code.querySelector('x');
		const yBefore = xBefore?.querySelector('y');

		assert.ok(xBefore && yBefore);
		assert.strictEqual(yBefore.parentNode, xBefore);

		Prism.highlightElement(code);

		assert.strictEqual(code.querySelector('x'), xBefore);
		assert.strictEqual(xBefore.querySelector('y'), yBefore);
		assert.strictEqual(yBefore.parentNode, xBefore);
		assert.equal(code.innerHTML, '<x>a<y></y></x>b');
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

	// The markup is removed if it's the last element and the element's name is a single letter: a(nchor), b(old), i(talic)...
	// https://github.com/PrismJS/prism/issues/1618
	/*
	it('should keep last single letter empty markup', function () {
		const result = execute(`<code class="language-none">xy<a></a></code>`)
		expect(result.start.length).to.equal(1)
		expect(result.end.length).to.equal(1)
		expect(result.nodes.length).to.equal(1)
		expect(result.nodes[0].nodeName).to.equal('A')
	})
	*/
});

/**
 * @template T
 * @typedef {import('../../types.d.ts').PrismDOM<T>} PrismDOM
 */
