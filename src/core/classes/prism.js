import globalDefaults from '../../config.js';
import { highlightAll } from '../highlight-all.js';
import { highlightElement } from '../highlight-element.js';
import { highlight } from '../highlight.js';
import { Registry } from '../registry.js';
import { tokenize } from '../tokenize/tokenize.js';
import { Hooks } from './hooks.js';

/**
 * Prism class, to create Prism instances with different settings.
 * In most use cases, you just need the pre-existing Prism instance, see {@link prism}.
 */
export default class Prism {
	/**
	 * @type {Hooks}
	 */
	hooks = new Hooks();

	/**
	 * @type {Registry}
	 */
	components = new Registry(this);

	/**
	 * @type {object}
	 */
	plugins = {};

	/**
	 * @type {PrismConfig}
	 */
	config = globalDefaults;

	/**
	 * See {@link highlightAll}.
	 *
	 * @param {HighlightAllOptions} [options]
	 */
	highlightAll (options = {}) {
		return highlightAll.call(this, options);
	}

	/**
	 * See {@link highlightElement}
	 *
	 * @param {Element} element
	 * @param {HighlightElementOptions} [options]
	 */
	highlightElement (element, options = {}) {
		return highlightElement.call(this, element, options);
	}

	/**
	 * See {@link highlight}
	 *
	 * @param {string} text
	 * @param {string} language
	 * @param {HighlightOptions} [options]
	 * @returns {string}
	 */
	highlight (text, language, options = {}) {
		return highlight.call(this, text, language, options);
	}

	/**
	 * See {@link tokenize}
	 *
	 * @param {string} text
	 * @param {Grammar} grammar
	 * @returns {TokenStream}
	 */
	tokenize (text, grammar) {
		return tokenize.call(this, text, grammar);
	}
}

/**
 * @typedef {import('../../config.d.ts').PrismConfig} PrismConfig
 */

/**
 * @typedef {import('../highlight-all.d.ts').HighlightAllOptions} HighlightAllOptions
 */

/**
 * @typedef {import('../highlight-element.d.ts').HighlightElementOptions} HighlightElementOptions
 */

/**
 * @typedef {import('../highlight.d.ts').HighlightOptions} HighlightOptions
 */

/**
 * @typedef {import('../../types.d.ts').Grammar} Grammar
 */

/**
 * @typedef {import('./token.d.ts').TokenStream} TokenStream
 */
