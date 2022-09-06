import { isActive } from '../../shared/dom-util';
import { combineCallbacks } from '../../shared/hooks-util';
import { lazy, noop } from '../../shared/util';

const LINE_NUMBERS_CLASS = 'line-numbers';
const LINKABLE_LINE_NUMBERS_CLASS = 'linkable-line-numbers';
const NEW_LINE_EXP = /\n(?!$)/g;

/**
 * @param {string} selector
 * @param {ParentNode} [container]
 * @returns {Element[]}
 */
function $$(selector, container = document) {
	return [...container.querySelectorAll(selector)];
}

/**
 * Returns the top offset of the content box of the given parent and the content box of one of its children.
 *
 * @param {HTMLElement} parent
 * @param {HTMLElement} child
 */
function getContentBoxTopOffset(parent, child) {
	const parentStyle = getComputedStyle(parent);
	const childStyle = getComputedStyle(child);

	/**
	 * Returns the numeric value of the given pixel value.
	 *
	 * @param {string} px
	 */
	function pxToNumber(px) {
		return +px.substr(0, px.length - 2);
	}

	return child.offsetTop
		+ pxToNumber(childStyle.borderTopWidth)
		+ pxToNumber(childStyle.paddingTop)
		- pxToNumber(parentStyle.paddingTop);
}

/**
 * Returns whether the given element has the given class.
 *
 * @param {Element} element
 * @param {string} className
 * @returns {boolean}
 */
function hasClass(element, className) {
	return element.classList.contains(className);
}

/**
 * Calls the given function.
 *
 * @param {() => void} func
 * @returns {void}
 */
function callFunction(func) {
	func();
}

// Some browsers round the line-height, others don't.
// We need to test for it to position the elements properly.
const isLineHeightRounded = lazy(() => {
	const d = document.createElement('div');
	d.style.fontSize = '13px';
	d.style.lineHeight = '1.5';
	d.style.padding = '0';
	d.style.border = '0';
	d.innerHTML = '&nbsp;<br />&nbsp;';
	document.body.appendChild(d);
	// Browsers that round the line-height should have offsetHeight === 38
	// The others should have 39.
	const result = d.offsetHeight === 38;
	document.body.removeChild(d);
	return result;
});


export class LineHighlight {
	/**
	 * @package
	 */
	scrollIntoView = true;
	/**
	 * @param {import('../../core/prism.js').Prism} Prism
	 */
	constructor(Prism) {
		this.Prism = Prism;
	}
	/**
	 * Highlights the lines of the given pre.
	 *
	 * This function is split into a DOM measuring and mutate phase to improve performance.
	 * The returned function mutates the DOM when called.
	 *
	 * @param {HTMLElement} pre
	 * @param {string | null} [lines]
	 * @param {string} [classes='']
	 * @returns {() => void}
	 */
	highlightLines(pre, lines, classes = '') {
		lines = typeof lines === 'string' ? lines : (pre.getAttribute('data-line') || '');

		const ranges = lines.replace(/\s+/g, '').split(',').filter(Boolean);
		const offset = Number(pre.getAttribute('data-line-offset')) || 0;

		const parseMethod = isLineHeightRounded() ? parseInt : parseFloat;
		const lineHeight = parseMethod(getComputedStyle(pre).lineHeight);
		const hasLineNumbers = isActive(pre, LINE_NUMBERS_CLASS);
		const codeElement = pre.querySelector('code');
		const parentElement = hasLineNumbers ? pre : codeElement || pre;
		const mutateActions = /** @type {(() => void)[]} */ ([]);
		const lineBreakMatch = codeElement?.textContent?.match(NEW_LINE_EXP);
		const numberOfLines = lineBreakMatch ? lineBreakMatch.length + 1 : 1;
		/**
		 * The top offset between the content box of the <code> element and the content box of the parent element of
		 * the line highlight element (either `<pre>` or `<code>`).
		 *
		 * This offset might not be zero for some themes where the <code> element has a top margin. Some plugins
		 * (or users) might also add element above the <code> element. Because the line highlight is aligned relative
		 * to the <pre> element, we have to take this into account.
		 *
		 * This offset will be 0 if the parent element of the line highlight element is the `<code>` element.
		 */
		const codePreOffset = !codeElement || parentElement === codeElement ? 0 : getContentBoxTopOffset(pre, codeElement);

		ranges.forEach((currentRange) => {
			const range = currentRange.split('-');

			const start = +range[0];
			let end = +range[1] || start;
			end = Math.min(numberOfLines + offset, end);

			if (end < start) {
				return;
			}

			/** @type {HTMLElement} */
			const line = pre.querySelector('.line-highlight[data-range="' + currentRange + '"]') || document.createElement('div');

			mutateActions.push(() => {
				line.setAttribute('aria-hidden', 'true');
				line.setAttribute('data-range', currentRange);
				line.className = classes + ' line-highlight';
			});

			// if the line-numbers plugin is enabled, then there is no reason for this plugin to display the line numbers
			if (hasLineNumbers && this.Prism.plugins.lineNumbers) {
				const startNode = this.Prism.plugins.lineNumbers.getLine(pre, start);
				const endNode = this.Prism.plugins.lineNumbers.getLine(pre, end);

				if (startNode) {
					const top = startNode.offsetTop + codePreOffset + 'px';
					mutateActions.push(() => {
						line.style.top = top;
					});
				}

				if (startNode && endNode) {
					const height = (endNode.offsetTop - startNode.offsetTop) + endNode.offsetHeight + 'px';
					mutateActions.push(() => {
						line.style.height = height;
					});
				}
			} else {
				mutateActions.push(() => {
					line.setAttribute('data-start', String(start));

					if (end > start) {
						line.setAttribute('data-end', String(end));
					}

					line.style.top = (start - offset - 1) * lineHeight + codePreOffset + 'px';

					line.textContent = new Array(end - start + 2).join(' \n');
				});
			}

			mutateActions.push(() => {
				line.style.width = pre.scrollWidth + 'px';
			});

			mutateActions.push(() => {
				// allow this to play nicely with the line-numbers plugin
				// need to attack to pre as when line-numbers is enabled, the code tag is relatively which screws up the positioning
				parentElement.appendChild(line);
			});
		});

		const id = pre.id;
		if (hasLineNumbers && this.Prism.plugins.lineNumbers && isActive(pre, LINKABLE_LINE_NUMBERS_CLASS) && id) {
			// This implements linkable line numbers. Linkable line numbers use Line Highlight to create a link to a
			// specific line. For this to work, the pre element has to:
			//  1) have line numbers,
			//  2) have the `linkable-line-numbers` class or an ascendant that has that class, and
			//  3) have an id.

			if (!hasClass(pre, LINKABLE_LINE_NUMBERS_CLASS)) {
				// add class to pre
				mutateActions.push(() => {
					pre.classList.add(LINKABLE_LINE_NUMBERS_CLASS);
				});
			}

			const start = parseInt(pre.getAttribute('data-start') || '1');

			// iterate all line number spans
			this.Prism.plugins.lineNumbers.getLines(pre)?.forEach((lineSpan, i) => {
				const lineNumber = i + start;
				lineSpan.onclick = () => {
					const hash = id + '.' + lineNumber;

					// this will prevent scrolling since the span is obviously in view
					this.scrollIntoView = false;
					location.hash = hash;
					setTimeout(() => {
						this.scrollIntoView = true;
					}, 1);
				};
			});
		}

		return function () {
			mutateActions.forEach(callFunction);
		};
	}
}

export default /** @type {import("../../types").PluginProto<'line-highlight'>} */ ({
	id: 'line-highlight',
	optional: 'line-numbers',
	plugin(Prism) {
		return new LineHighlight(Prism);
	},
	effect(Prism) {
		if (typeof document === 'undefined') {
			return noop;
		}

		/**
		 * Returns whether the Line Highlight plugin is active for the given element.
		 *
		 * If this function returns `false`, do not call `highlightLines` for the given element.
		 *
		 * @param {Element | null | undefined} pre
		 * @returns {pre is HTMLPreElement}
		 */
		function isActiveFor(pre) {
			if (!pre || !/pre/i.test(pre.nodeName)) {
				return false;
			}

			if (pre.hasAttribute('data-line')) {
				return true;
			}

			if (pre.id && isActive(pre, LINKABLE_LINE_NUMBERS_CLASS)) {
				// Technically, the line numbers plugin is also necessary but this plugin doesn't control the classes of
				// the line numbers plugin, so we can't assume that they are present.
				return true;
			}

			return false;
		}

		const applyHash = () => {
			const hash = location.hash.slice(1);

			// Remove pre-existing temporary lines
			$$('.temporary.line-highlight').forEach((line) => {
				line.remove();
			});

			const range = (hash.match(/\.([\d,-]+)$/) || [, ''])[1];

			if (!range || document.getElementById(hash)) {
				return;
			}

			const id = hash.slice(0, hash.lastIndexOf('.'));
			const pre = document.getElementById(id);

			if (!pre) {
				return;
			}

			if (!pre.hasAttribute('data-line')) {
				pre.setAttribute('data-line', '');
			}

			const mutateDom = Prism.plugins.lineHighlight.highlightLines(pre, range, 'temporary ');
			mutateDom();

			if (Prism.plugins.lineHighlight.scrollIntoView) {
				document.querySelector('.temporary.line-highlight')?.scrollIntoView();
			}
		};
		const onResize = () => {
			$$('pre')
				.filter(isActiveFor)
				.map((pre) => {
					return Prism.plugins.lineHighlight.highlightLines(pre);
				})
				.forEach(callFunction);
		};

		window.addEventListener('hashchange', applyHash);
		window.addEventListener('resize', onResize);

		const removeEventListeners = () => {
			window.removeEventListener('hashchange', applyHash);
			window.removeEventListener('resize', onResize);
		};

		/** @type {number | NodeJS.Timeout | undefined} */
		let fakeTimer = undefined; // Hack to limit the number of times applyHash() runs

		const beforeSanityHook = Prism.hooks.add('before-sanity-check', (env) => {
			const pre = env.element.parentElement;
			if (!isActiveFor(pre)) {
				return;
			}

			/*
				 * Cleanup for other plugins (e.g. autoloader).
				 *
				 * Sometimes <code> blocks are highlighted multiple times. It is necessary
				 * to cleanup any left-over tags, because the whitespace inside of the <div>
				 * tags change the content of the <code> tag.
				 */
			let num = 0;
			$$('.line-highlight', pre).forEach((line) => {
				num += (line.textContent || '').length;
				line.remove();
			});
			// Remove extra whitespace
			if (num && /^(?: \n)+$/.test(env.code.slice(-num))) {
				env.code = env.code.slice(0, -num);
			}
		});

		const completeHook = Prism.hooks.add('complete', (env) => {
			const pre = env.element.parentElement;
			if (!isActiveFor(pre)) {
				return;
			}

			if (fakeTimer !== undefined) {
				// @ts-ignore
				clearTimeout(fakeTimer);
			}

			const mutateDom = Prism.plugins.lineHighlight.highlightLines(pre);
			mutateDom();
			fakeTimer = setTimeout(applyHash, 1);
		});

		return combineCallbacks(removeEventListeners, beforeSanityHook, completeHook);
	}
});
