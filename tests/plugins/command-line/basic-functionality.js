import { assert } from 'chai';
import { createTestSuite } from '../../helper/prism-dom-util.js';

describe('Command Line', () => {
	const { it } = createTestSuite({
		languages: 'bash',
		plugins: 'command-line',
	});

	/**
	 * @param {import('../../types.d.ts').PrismDOM<{}>} dom
	 * @param {number} expectedPrompts
	 * @param {string} code
	 */
	function test ({ document, Prism }, expectedPrompts, code) {
		document.body.innerHTML = `<pre class="command-line language-bash"><code>${code}</code></pre>`;
		Prism.highlightAll();

		assert.strictEqual(
			document.querySelectorAll('.command-line-prompt > span').length,
			expectedPrompts
		);
	}

	it('should prompt every line', dom => {
		test(dom, 2, 'cd ~/.vim\nvim vimrc');
		test(dom, 3, 'cd ~/.vim\n\nvim vimrc');
	});

	// Markdown code fences end with one
	it('should not prompt after a final line break', dom => {
		test(dom, 2, 'cd ~/.vim\nvim vimrc\n');
		test(dom, 3, 'cd ~/.vim\nvim vimrc\n\n');
	});

	// Copy to Clipboard copies the element's text
	it('should keep the final line break in the code', ({ document, Prism }) => {
		document.body.innerHTML = `<pre class="command-line language-bash"><code>ls\nfile.txt\n</code></pre>`;
		Prism.highlightAll();

		assert.strictEqual(document.querySelector('code')?.textContent, 'ls\nfile.txt\n');
	});

	it('should keep output on the last line', ({ document, Prism }) => {
		document.body.innerHTML = `<pre class="command-line language-bash" data-output="2"><code>ls\nfile.txt\n</code></pre>`;
		Prism.highlightAll();

		assert.strictEqual(document.querySelector('.token.output')?.textContent, 'file.txt');
	});

	// The Autoloader highlights an element again once its language loads
	// https://github.com/PrismJS/prism/issues/1416
	// https://github.com/PrismJS/prism/issues/3774
	it('should keep filtered output and continuations when highlighted again', ({
		document,
		Prism,
	}) => {
		document.body.innerHTML = `<pre class="command-line language-bash" data-filter-output="(out)" data-filter-continuation="(con)"><code>ls\n(out)file.txt\necho a \\\n(con)b</code></pre>`;
		const code = /** @type {HTMLElement} */ (document.querySelector('code'));
		Prism.highlightElement(code);
		const firstPass = code.innerHTML;

		Prism.highlightElement(code);

		assert.strictEqual(code.innerHTML, firstPass);
	});

	// A live terminal demo appends the next command and highlights again
	it('should keep filtered output when code is appended', ({ document, Prism }) => {
		document.body.innerHTML = `<pre class="command-line language-bash" data-filter-output="(out)"><code>ls\n(out)foo</code></pre>`;
		const code = /** @type {HTMLElement} */ (document.querySelector('code'));
		Prism.highlightElement(code);

		code.append('\npwd');
		Prism.highlightElement(code);

		assert.deepStrictEqual(
			[...code.querySelectorAll('.token.command, .token.output')].map(
				line => `${line.classList[1]} ${line.textContent}`
			),
			['command ls', 'output foo', 'command pwd']
		);
	});
});

describe('Command Line with Normalize Whitespace', () => {
	const { it } = createTestSuite({
		languages: 'bash',
		plugins: ['command-line', 'normalize-whitespace'],
	});

	// On the second pass, Normalize Whitespace trims the shown output before Command Line sees it,
	// e.g. `  total 3` becomes `total 3`
	it('should keep indented output when highlighted again', ({ document, Prism }) => {
		document.body.innerHTML = `<pre class="command-line language-bash" data-filter-output="(out)"><code>(out)  total 3\nls</code></pre>`;
		const code = /** @type {HTMLElement} */ (document.querySelector('code'));
		Prism.highlightElement(code);
		const firstPass = code.innerHTML;

		Prism.highlightElement(code);

		assert.strictEqual(code.innerHTML, firstPass);
	});
});
