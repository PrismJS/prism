import type { AsyncHighlighter } from './highlight-element.d.ts';

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
