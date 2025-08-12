import type { Grammar } from '../types.d.ts';

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

export interface AsyncHighlightingData {
	language: string;
	code: string;
	grammar: Grammar;
}

export type AsyncHighlighter = (data: AsyncHighlightingData) => Promise<string>;
