import { getParentPre, isActive } from '../../shared/dom-util.js';
import { combineCallbacks } from '../../shared/hooks-util.js';
import { isNonNull, noop } from '../../shared/util.js';

/**
 * Plugin name which is used as a class name for <pre> which is activating the plugin
 *
 * @type {string}
 */
const PLUGIN_NAME = 'line-numbers';

/**
 * Regular expression used for determining line breaks
 *
 * @type {RegExp}
 */
const NEW_LINE_EXP = /\n(?!$)/g;

/**
 * Queries for the `line-numbers-rows` element
 *
 * @param {Element} element
 * @returns {HTMLElement | null}
 */
function getLineNumbersRows(element) {
	return element.querySelector('.line-numbers-rows');
}

/**
 * Resizes the given elements.
 *
 * @param {Element[]} elements
 */
function resizeElements(elements) {
	elements = elements.filter((e) => {
		const codeStyles = getComputedStyle(e);
		const whiteSpace = codeStyles.whiteSpace;
		return whiteSpace === 'pre-wrap' || whiteSpace === 'pre-line';
	});

	if (elements.length == 0) {
		return;
	}

	/**
	 * @type {{
	 *   element: Element;
	 *   lines: string[];
	 *   lineHeights: (number | undefined)[];
	 *   oneLinerHeight: number;
	 *   sizer: HTMLElement;
	 *   wrapper: HTMLElement;
	 * }[]}
	 */
	const infos = elements.map((element) => {
		const codeElement = element.querySelector('code');
		const lineNumbersWrapper = getLineNumbersRows(element);
		if (!codeElement || !lineNumbersWrapper) {
			return undefined;
		}

		/** @type {HTMLElement | null} */
		let lineNumberSizer = element.querySelector('.line-numbers-sizer');
		const codeLines = codeElement.textContent.split(NEW_LINE_EXP);

		if (!lineNumberSizer) {
			lineNumberSizer = document.createElement('span');
			lineNumberSizer.className = 'line-numbers-sizer';

			codeElement.appendChild(lineNumberSizer);
		}

		lineNumberSizer.innerHTML = '0';
		lineNumberSizer.style.display = 'block';

		const oneLinerHeight = lineNumberSizer.getBoundingClientRect().height;
		lineNumberSizer.innerHTML = '';

		return {
			element,
			lines: codeLines,
			lineHeights: [],
			oneLinerHeight,
			sizer: lineNumberSizer,
			wrapper: lineNumbersWrapper
		};
	}).filter(isNonNull);

	infos.forEach((info) => {
		const lineNumberSizer = info.sizer;
		const lines = info.lines;
		const lineHeights = info.lineHeights;
		const oneLinerHeight = info.oneLinerHeight;

		lineHeights[lines.length - 1] = undefined;
		lines.forEach((line, index) => {
			if (line && line.length > 1) {
				const e = lineNumberSizer.appendChild(document.createElement('span'));
				e.style.display = 'block';
				e.textContent = line;
			} else {
				lineHeights[index] = oneLinerHeight;
			}
		});
	});

	infos.forEach((info) => {
		const lineNumberSizer = info.sizer;
		const lineHeights = info.lineHeights;

		let childIndex = 0;
		for (let i = 0; i < lineHeights.length; i++) {
			if (lineHeights[i] === undefined) {
				lineHeights[i] = lineNumberSizer.children[childIndex++].getBoundingClientRect().height;
			}
		}
	});

	infos.forEach((info) => {
		const lineNumberSizer = info.sizer;

		lineNumberSizer.style.display = 'none';
		lineNumberSizer.innerHTML = '';

		info.lineHeights.forEach((height, lineNumber) => {
			info.wrapper.children[lineNumber].style.height = height + 'px';
		});
	});
}

class LineNumbers {
	/**
	 * Whether the plugin can assume that the units font sizes and margins are not depended on the size of
	 * the current viewport.
	 *
	 * Setting this to `true` will allow the plugin to do certain optimizations for better performance.
	 *
	 * Set this to `false` if you use any of the following CSS units: `vh`, `vw`, `vmin`, `vmax`.
	 *
	 * @type {boolean}
	 */
	assumeViewportIndependence = true;

	/**
	 * Get node for provided line number
	 *
	 * @param {Element} element pre element
	 * @param {number} number line number
	 * @returns {Element|undefined}
	 */
	getLine(element, number) {
		if (element.tagName !== 'PRE' || !element.classList.contains(PLUGIN_NAME)) {
			return;
		}

		const lineNumberRows = getLineNumbersRows(element);
		if (!lineNumberRows) {
			return;
		}
		const lineNumberStart = parseInt(String(element.getAttribute('data-start')), 10) || 1;
		const lineNumberEnd = lineNumberStart + (lineNumberRows.children.length - 1);

		if (number < lineNumberStart) {
			number = lineNumberStart;
		}
		if (number > lineNumberEnd) {
			number = lineNumberEnd;
		}

		const lineIndex = number - lineNumberStart;

		return lineNumberRows.children[lineIndex];
	}

	/**
	 * Resizes the line numbers of the given element.
	 *
	 * This function will not add line numbers. It will only resize existing ones.
	 *
	 * @param {Element} element A `<pre>` element with line numbers.
	 * @returns {void}
	 */
	resize(element) {
		resizeElements([element]);
	}
}

export default /** @type {import("../../types").PluginProto} */ ({
	id: 'line-numbers',
	plugin() {
		return new LineNumbers();
	},
	effect(Prism) {
		if (typeof document === 'undefined') {
			return noop;
		}

		const config = /** @type {LineNumbers} */ (Prism.plugins.lineNumbers);

		let lastWidth = NaN;
		const listener = () => {
			if (config.assumeViewportIndependence && lastWidth === window.innerWidth) {
				return;
			}
			lastWidth = window.innerWidth;

			resizeElements([...document.querySelectorAll('pre.' + PLUGIN_NAME)]);
		};
		window.addEventListener('resize', listener);
		const removeListener = () => {
			window.removeEventListener('resize', listener);
		};

		const completeHook = Prism.hooks.add('complete', (env) => {
			if (!env.code) {
				return;
			}

			const code = /** @type {Element} */ (env.element);
			const pre = getParentPre(code);

			// works only for <code> wrapped inside <pre> (not inline)
			if (!pre) {
				return;
			}

			// Abort if line numbers already exists
			if (getLineNumbersRows(code)) {
				return;
			}

			// only add line numbers if <code> or one of its ancestors has the `line-numbers` class
			if (!isActive(code, PLUGIN_NAME)) {
				return;
			}

			// Remove the class 'line-numbers' from the <code>
			code.classList.remove(PLUGIN_NAME);
			// Add the class 'line-numbers' to the <pre>
			pre.classList.add(PLUGIN_NAME);

			const match = env.code.match(NEW_LINE_EXP);
			const linesNum = match ? match.length + 1 : 1;

			const lines = '<span></span>'.repeat(linesNum);

			const lineNumbersWrapper = document.createElement('span');
			lineNumbersWrapper.setAttribute('aria-hidden', 'true');
			lineNumbersWrapper.className = 'line-numbers-rows';
			lineNumbersWrapper.innerHTML = lines;

			if (pre.hasAttribute('data-start')) {
				pre.style.counterReset = 'linenumber ' + (parseInt(String(pre.getAttribute('data-start')), 10) - 1);
			}

			env.element.appendChild(lineNumbersWrapper);

			resizeElements([pre]);

			Prism.hooks.run('line-numbers', env);
		});

		const lnHook = Prism.hooks.add('line-numbers', (env) => {
			env.plugins = env.plugins || {};
			env.plugins.lineNumbers = true;
		});

		return combineCallbacks(removeListener, completeHook, lnHook);
	}
});
