import { LinkedList } from '../linked-list.js';
import singleton from '../prism.js';
import { _matchGrammar } from './match.js';

/**
 * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
 * and the language definitions to use, and returns an array with the tokenized code.
 *
 * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
 *
 * This method could be useful in other contexts as well, as a very crude parser.
 *
 * @this {Prism}
 * @param {string} text A string with the code to be highlighted.
 * @param {Grammar} grammar An object containing the tokens to use.
 *
 * Usually a language definition like `Prism.languages.markup`.
 * @returns {TokenStream} An array of strings and tokens, a token stream.
 * @example
 * let code = `var foo = 0;`;
 * let tokens = Prism.tokenize(code, Prism.getLanguage('javascript'));
 * tokens.forEach(token => {
 *     if (token instanceof Token && token.type === 'number') {
 *         console.log(`Found numeric literal: ${token.content}`);
 *     }
 * });
 */
export function tokenize (text, grammar) {
	const prism = this ?? singleton;
	const customTokenize = grammar.$tokenize;
	if (customTokenize) {
		return customTokenize(text, grammar, prism);
	}

	const tokenList = new LinkedList();
	tokenList.addAfter(tokenList.head, text);

	_matchGrammar.call(
		prism,
		text,
		tokenList,
		/** @type {GrammarTokens} */ (grammar),
		tokenList.head,
		0
	);

	return tokenList.toArray();
}

/**
 * @import { TokenStream, Grammar, GrammarTokens } from '../../types.d.ts';
 * @import { Prism } from '../prism.js';
 */
