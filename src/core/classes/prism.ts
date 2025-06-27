import globalDefaults from '../../config';
import { highlight } from '../highlight';
import { highlightAll } from '../highlight-all';
import { highlightElement } from '../highlight-element';
import { Registry } from '../registry';
import { tokenize } from '../tokenize/tokenize';
import { Hooks } from './hooks';
import type { Grammar } from '../../types';
import type { HighlightOptions } from '../highlight';
import type { HighlightAllOptions } from '../highlight-all';
import type { HighlightElementOptions } from '../highlight-element';
import type { TokenStream } from './token';

/**
 * Prism class, to create Prism instances with different settings.
 * In most use cases, you just need the pre-existing Prism instance, see {@link prism}.
 */
export default class Prism {
	hooks = new Hooks();
	components = new Registry(this);
	plugins: Record<string, unknown> = {};
	config = globalDefaults;

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

export type { Prism };
