import { LinkedList } from '../linked-list';
import singleton from '../prism';
import { _matchGrammar } from './match';
import type { Grammar } from '../../types';
import type { Token, TokenStream } from '../classes/token';
import type { Prism } from '../prism';

/**
 * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
 * and the language definitions to use, and returns an array with the tokenized code.
 *
 * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
 *
 * This method could be useful in other contexts as well, as a very crude parser.
 *
 * @param text A string with the code to be highlighted.
 * @param grammar An object containing the tokens to use.
 *
 * Usually a language definition like `Prism.languages.markup`.
 * @returns An array of strings and tokens, a token stream.
 * @example
 * let code = `var foo = 0;`;
 * let tokens = Prism.tokenize(code, Prism.getLanguage('javascript'));
 * tokens.forEach(token => {
 *     if (token instanceof Token && token.type === 'number') {
 *         console.log(`Found numeric literal: ${token.content}`);
 *     }
 * });
 */
export function tokenize (this: Prism, text: string, grammar: Grammar): TokenStream {
	const prism = this ?? singleton;
	const customTokenize = grammar.$tokenize;
	if (customTokenize) {
		return customTokenize(text, grammar, prism);
	}

	const tokenList = new LinkedList<string | Token>();
	tokenList.addAfter(tokenList.head, text);

	_matchGrammar.call(prism, text, tokenList, grammar, tokenList.head, 0);

	return tokenList.toArray();
}
