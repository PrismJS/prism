import singleton from './prism.js';

/**
 * This is the most high-level function in Prism's API.
 * It queries all the elements that have a `.language-xxxx` class and then calls {@link Prism#highlightElement} on
 * each one of them.
 *
 * The following hooks will be run:
 * 1. `before-highlightall`
 * 2. `before-all-elements-highlight`
 * 3. All hooks of {@link Prism#highlightElement} for each element.
 *
 * @this {Prism}
 * @param {HighlightAllOptions} [options={}]
 */
export function highlightAll (options = {}) {
	const prism = this ?? singleton;
	const { root, async, callback } = options;

	/** @type {HookEnv} */
	const env = {
		callback,
		root: root ?? document,
		selector:
			'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
	};

	prism.hooks.run('before-highlightall', env);

	env.elements = [...env.root.querySelectorAll(env.selector)];

	prism.hooks.run('before-all-elements-highlight', env);

	for (const element of env.elements) {
		prism.highlightElement(element, { async, callback: env.callback });
	}
}

/**
 * @typedef {import('./prism.js').Prism} Prism
 * @typedef {import('../types.d.ts').HookEnv} HookEnv
 * @typedef {import('./highlight-element.js').AsyncHighlighter} AsyncHighlighter
 */

/**
 * @typedef {object} HighlightAllOptions
 * @property {ParentNode} [root] The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
 * @property {AsyncHighlighter} [async]
 * @property {(element: Element) => void} [callback] An optional callback to be invoked on each element after its highlighting is done. @see HighlightElementOptionsCallback
 */
