import { Grammar } from '../types.d.ts';

export interface AsyncHighlightingData {
	language: string;
	code: string;
	grammar: Grammar;
}
export type AsyncHighlighter = (data: AsyncHighlightingData) => Promise<string>;

export interface HighlightAllOptions {
	/**
	 * The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
	 */
	root?: ParentNode;
	async?: AsyncHighlighter;
	/**
	 * An optional callback to be invoked on each element after its highlighting is done.
	 *
	 * @see HighlightElementOptions.callback
	 */
	callback?: (element: Element) => void;
}

export interface HighlightElementOptions {
	async?: AsyncHighlighter;
	/**
	 * An optional callback to be invoked after the highlighting is done.
	 * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
	 *
	 * @param element The element successfully highlighted.
	 */
	callback?: (element: Element) => void;
}

export interface HighlightOptions {
	grammar?: Grammar;
}
