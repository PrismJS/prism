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
	const grammar =
		options?.grammar ?? this.languageRegistry.getLanguage(language)?.resolvedGrammar;

	/** @type {HookEnv} */
	const env = {
		code: text,
		grammar,
		language,
	};
	this.hooks.run('before-tokenize', env);
	if (!env.grammar) {
		throw new Error('The language "' + env.language + '" has no grammar.');
	}

	env.tokens = this.tokenize(env.code, env.grammar);
	this.hooks.run('after-tokenize', env);

	return stringify(env.tokens, env.language, this.hooks);
}

/**
 * @import { Prism } from './prism.js';
 * @import { HookEnv, Grammar } from '../types.d.ts';
 */

/**
 * @typedef {object} HighlightOptions
 * @property {Grammar} [grammar]
 */
