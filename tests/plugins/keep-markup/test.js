const { assert } = require('chai');
const { createScopedPrismDom } = require('../../helper/prism-dom-util');


describe('Keep Markup', function () {
	const { Prism, document } = createScopedPrismDom(this, {
		languages: 'javascript',
		plugins: 'keep-markup'
	});


	/**
	 * @param {string} html
	 * @param {string} language
	 */
	function highlightInElement(html, language = 'none') {
		const pre = document.createElement('pre');
		pre.className = `language-${language}`;
		pre.innerHTML = `<code>${html}</code>`;

		Prism.highlightElement(pre);

		return pre.querySelector('code').innerHTML;
	}

	/**
	 * @param {string} html
	 * @param {string} language
	 */
	function keepMarkup(html, language = 'none') {
		assert.equal(highlightInElement(html, language), html);
	}

	it('should keep <span> markup', function () {
		keepMarkup(`x<span>a</span>y`);
	});
	it('should preserve markup order', function () {
		keepMarkup(`x<a></a><b></b>y`);
	});

	it('should keep last markup', function () {
		keepMarkup(`xy<span>a</span>`);
		keepMarkup(`xy<a>a</a>`);
	});

	it('should support double highlighting', function () {
		const pre = document.createElement('pre');
		pre.className = 'language-javascript drop-tokens';
		pre.innerHTML = '<code>var <mark>a = 42</mark>;</code>';
		const code = pre.childNodes[0];
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
