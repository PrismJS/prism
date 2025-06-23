import singleton from './prism';
import type { HookEnv } from './classes/hooks';
import type { AsyncHighlighter } from './highlight-element';
import type { Prism } from './prism';

/**
 * This is the most high-level function in Prism’s API.
 * It queries all the elements that have a `.language-xxxx` class and then calls {@link Prism#highlightElement} on
 * each one of them.
 *
 * The following hooks will be run:
 * 1. `before-highlightall`
 * 2. `before-all-elements-highlight`
 * 3. All hooks of {@link Prism#highlightElement} for each element.
 */
export function highlightAll (this: Prism, options: HighlightAllOptions = {}) {
	const prism = this ?? singleton;
	const { root, async, callback } = options;

	const env: HookEnv = {
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

export interface HighlightAllOptions {
	/**
	 * The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
	 */
	root?: ParentNode;
	async?: AsyncHighlighter;
	/**
	 * An optional callback to be invoked on each element after its highlighting is done.
	 *
	 * @see HighlightElementOptions#callback
	 */
	callback?: (element: Element) => void;
}
