import { assert } from 'chai';
import { createTestSuite } from '../../helper/prism-dom-util';
import type { PrismDOM } from '../../helper/prism-loader';


describe('Keep Markup', () => {
	const { it } = createTestSuite({
		languages: 'javascript',
		plugins: 'keep-markup'
	});


	function highlightInElement({ Prism, document }: PrismDOM<{}>, html: string, language = 'none') {
		const pre = document.createElement('pre');
		pre.className = `language-${language}`;
		pre.innerHTML = `<code>${html}</code>`;
		const code = pre.children[0];

		Prism.highlightElement(code);

		return code.innerHTML;
	}

	function keepMarkup(dom: PrismDOM<{}>, html: string, language = 'none') {
		assert.equal(highlightInElement(dom, html, language), html);
	}

	it('should keep <span> markup', (dom) => {
		keepMarkup(dom, `x<span>a</span>y`);
	});
	it('should preserve markup order', (dom) => {
		keepMarkup(dom, `x<a></a><b></b>y`);
	});

	it('should keep last markup', (dom) => {
		keepMarkup(dom, `xy<span>a</span>`);
		keepMarkup(dom, `xy<a>a</a>`);
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
