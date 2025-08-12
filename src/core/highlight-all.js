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
 * @this {import('./prism.js').Prism}
 * @param {import('./highlight-all.d.ts').HighlightAllOptions} [options={}]
 */
export function highlightAll (options = {}) {
	const prism = this ?? singleton;
	const { root, async, callback } = options;

	/** @type {import('./classes/hooks.d.ts').HookEnv} */
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
