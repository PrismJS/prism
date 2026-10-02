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
});
