import singleton from './prism.js';
import stringify from './stringify.js';

/**
 * Low-level function, only use if you know what you're doing. It accepts a string of text as input
 * and the language definitions to use, and returns a string with the HTML produced.
 *
 * The following hooks will be run:
 * 1. `before-tokenize`
 * 2. `after-tokenize`
 * 3. `wrap`: On each {@link Token}.
 *
 * @this {Prism}
 * @param {string} text A string with the code to be highlighted.
 * @param {string} language The name of the language definition passed to `grammar`.
 * @param {HighlightOptions} [options] An object containing the tokens to use.
 *
 * Usually a language definition like `Prism.languages.markup`.
 * @returns {string} The highlighted HTML.
 * @example
 * Prism.highlight('var foo = true;', 'javascript');
 */
export function highlight (text, language, options) {
	const prism = this ?? singleton;

	const languageId = this.components.resolveAlias(language);
	const grammar = options?.grammar ?? this.components.getLanguage(languageId);

	/** @type {HookEnv} */
	const env = {
		code: text,
		grammar,
		language,
	};
	prism.hooks.run('before-tokenize', env);
	if (!env.grammar) {
		throw new Error('The language "' + env.language + '" has no grammar.');
	}

	env.tokens = prism.tokenize(env.code, env.grammar);
	prism.hooks.run('after-tokenize', env);

	return stringify(env.tokens, env.language, prism.hooks);
}

/**
 * @typedef {import('./prism.js').Prism} Prism
 * @typedef {import('../types.d.ts').HookEnv} HookEnv
 * @typedef {import('../types.d.ts').Grammar} Grammar
 */

/**
 * @typedef {object} HighlightOptions
 * @property {Grammar} [grammar]
 */
