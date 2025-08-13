import { getLanguage, setLanguage } from '../shared/dom-util.js';
import { htmlEncode } from '../shared/util.js';
import singleton from './prism.js';

/**
 * Highlights the code inside a single element.
 *
 * The following hooks will be run:
 * 1. `before-sanity-check`
 * 2. `before-highlight`
 * 3. All hooks of {@link Prism#highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
 * 4. `before-insert`
 * 5. `after-highlight`
 * 6. `complete`
 *
 * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
 * the element's language.
 *
 * @this {Prism}
 * @param {Element} element The element containing the code. It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
 * @param {HighlightElementOptions} [options={}]
 */
export function highlightElement (element, options = {}) {
	const prism = this ?? singleton;
	const { async, callback } = options;

	// Find language
	const language = getLanguage(element);
	const languageId = this.components.resolveAlias(language);
	const grammar = this.components.getLanguage(languageId);

	// Set language on the element, if not present
	setLanguage(element, language);

	// Set language on the parent, for styling
	let parent = element.parentElement;
	if (parent && parent.nodeName.toLowerCase() === 'pre') {
		setLanguage(parent, language);
	}

	const code = element.textContent;

	/** @type {HookEnv} */
	const env = {
		element,
		language,
		grammar,
		code,
	};

	/**
	 * @param {string} highlightedCode
	 */
	const insertHighlightedCode = highlightedCode => {
		env.highlightedCode = highlightedCode;
		prism.hooks.run('before-insert', env);

		env.element.innerHTML = env.highlightedCode;

		prism.hooks.run('after-highlight', env);
		prism.hooks.run('complete', env);
		callback?.(env.element);
	};

	prism.hooks.run('before-sanity-check', env);

	// plugins may change/add the parent/element
	parent = env.element.parentElement;
	if (parent && parent.nodeName.toLowerCase() === 'pre' && !parent.hasAttribute('tabindex')) {
		parent.setAttribute('tabindex', '0');
	}

	if (!env.code) {
		prism.hooks.run('complete', env);
		callback?.(env.element);
		return;
	}

	prism.hooks.run('before-highlight', env);

	if (!env.grammar) {
		insertHighlightedCode(htmlEncode(env.code));
		return;
	}

	if (async) {
		async({
			language: env.language,
			code: env.code,
			grammar: env.grammar,
		}).then(insertHighlightedCode, error => console.log(error));
	}
	else {
		insertHighlightedCode(prism.highlight(env.code, env.language, { grammar: env.grammar }));
	}
}

/**
 * @typedef {import('./prism.js').Prism} Prism
 * @typedef {import('../types.d.ts').HookEnv} HookEnv
 * @typedef {import('../types.d.ts').Grammar} Grammar
 */

/**
 * @typedef {object} HighlightElementOptions
 * @property {AsyncHighlighter} [async]
 * @property {HighlightElementOptionsCallback} [callback]
 */

/**
 * An optional callback to be invoked after the highlighting is done.
 * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
 *
 * @callback HighlightElementOptionsCallback
 * @param {Element} element The element successfully highlighted.
 * @returns {void}
 */

/**
 * @typedef {object} AsyncHighlightingData
 * @property {string} language
 * @property {string} code
 * @property {Grammar} grammar
 */

/**
 * @callback AsyncHighlighter
 * @param {AsyncHighlightingData} data
 * @returns {Promise<string>}
 */
