import { assert } from 'chai';
import { createTestSuite } from '../../helper/prism-dom-util.js';

describe('Line Numbers', () => {
	const { it } = createTestSuite({
		plugins: 'line-numbers',
	});

	// `data-start="0"` numbers the lines 0, 1, 2
	it('should find a line counted from data-start="0"', ({ document, Prism }) => {
		document.body.innerHTML = `<pre class="line-numbers language-none" data-start="0"><code>a
b
c</code></pre>`;
		Prism.highlightAll();

		const pre = /** @type {HTMLPreElement} */ (document.querySelector('pre'));
		const rows = pre.querySelectorAll('.line-numbers-rows > span');
		const lineNumbers = Prism.pluginRegistry.peek('line-numbers')?.plugin;

		assert.strictEqual(lineNumbers.getLine(pre, 1), rows[1]);
	});
});
