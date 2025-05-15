import { getLanguage, setLanguage } from '../shared/dom-util';
import { htmlEncode } from '../shared/util';
import type { Grammar, GrammarToken, GrammarTokens, RegExpLike } from '../types';
import singleton, { type Prism } from './prism';

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
 * @param element The element containing the code.
 * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
 */
export function highlightElement (
	this: Prism,
	element: Element,
	options: HighlightElementOptions = {}
) {
	const prism = this ?? singleton;
	const { async, callback } = options;

	// Find language
	const language = getLanguage(element);
	const languageId = prism.components.resolveAlias(language);
	const grammar = prism.languageRegistry.getLanguage(languageId);

	// Set language on the element, if not present
	setLanguage(element, language);

	// Set language on the parent, for styling
	let parent = element.parentElement;
	if (parent && parent.nodeName.toLowerCase() === 'pre') {
		setLanguage(parent, language);
	}

	const code = element.textContent as string;

	const env: Record<string, any> = {
		element,
		language,
		grammar,
		code,
	};

	const insertHighlightedCode = (highlightedCode: string) => {
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
