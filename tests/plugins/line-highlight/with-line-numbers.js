import { assert } from 'chai';
import { createTestSuite } from '../../helper/prism-dom-util.js';

const code = 'let a = 1;\nlet b = 2;\nlet c = 3;';

/**
 * @param {import('../../helper/prism-loader.js').PrismDOM<{}>} dom
 */
function highlightLine ({ Prism, document }) {
	const pre = document.createElement('pre');
	pre.className = 'line-numbers';
	pre.setAttribute('data-line', '2');

	const codeElement = document.createElement('code');
	codeElement.className = 'language-javascript';
	codeElement.textContent = code;
	pre.appendChild(codeElement);
	document.body.appendChild(pre);

	Prism.highlightElement(codeElement);

	const line = pre.querySelector('.line-highlight');
	if (!line) {
		throw new Error('missing .line-highlight');
	}
	return line.getAttribute('style') || '';
}

describe('Line Highlight with Line Numbers (#4137)', () => {
	for (const plugins of [
		['line-highlight', 'line-numbers'],
		['line-numbers', 'line-highlight'],
	]) {
		const { it } = createTestSuite({
			languages: 'javascript',
			plugins,
		});

		it(`positions the highlight when plugins load as ${plugins.join(' then ')}`, dom => {
			const style = highlightLine(dom);

			assert.match(style, /(?:^|;)\s*top:\s*\d/);
			assert.match(style, /(?:^|;)\s*height:\s*\d/);
		});
	}
});
