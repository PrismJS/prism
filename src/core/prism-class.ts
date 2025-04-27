import { Hooks } from './hooks';
import { Registry } from './registry';
import { highlightAll, type HighlightAllOptions } from './highlight-all';
import { highlightElement, type HighlightElementOptions } from './highlight-element';
import { highlight, type HighlightOptions } from './highlight';
import { tokenize } from './tokenize';
import type { Grammar, GrammarToken, GrammarTokens, RegExpLike } from '../types';
import type { TokenStream } from './token';

/**
 * Prism class, to create Prism instances with different settings.
 * In most use cases, you just need the pre-existing Prism instance, see {@link prism}.
 */
export default class Prism {
	hooks = new Hooks();
	components = new Registry(this);
	plugins: Record<string, unknown> = {};

	/**
	 * See {@link highlightAll}.
	 */
	highlightAll (options: HighlightAllOptions = {}) {
		return highlightAll.call(this, options);
	}

	/**
	 * See {@link highlightElement}
	 */
	highlightElement (element: Element, options: HighlightElementOptions = {}) {
		return highlightElement.call(this, element, options);
	}

	/**
	 * See {@link highlight}
	 */
	highlight (text: string, language: string, options: HighlightOptions = {}): string {
		return highlight.call(this, text, language, options);
	}

	/**
	 * See {@link tokenize}
	 */
	tokenize (text: string, grammar: Grammar): TokenStream {
		return tokenize.call(this, text, grammar);
	}
}
