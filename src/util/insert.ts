import { betterAssign } from './objects';
import type { Grammar, GrammarTokens } from '../types';

/**
 * Inserts tokens _before_ another token in the given grammar.
 *
 * ## Usage
 *
 * This helper method makes it easy to modify existing grammars. For example, the CSS language definition
 * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
 * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
 * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
 * this:
 *
 * ```js
 * markup.style = {
 *     // token
 * };
 * ```
 *
 * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
 * before existing tokens. For the CSS example above, you would use it like this:
 *
 * ```js
 * insertBefore(markup, 'cdata', {
 *     'style': {
 *         // token
 *     }
 * });
 * ```
 *
 * @param grammar The grammar to be modified.
 * @param beforeKey The key to insert before.
 * @param tokens An object containing the key-value pairs to be inserted.
 */
export function insertBefore (grammar: Grammar, beforeKey: string, tokens: GrammarTokens) {
	insert(grammar, beforeKey, tokens, 'before');
}

export function insertAfter (grammar: Grammar, afterKey: string, tokens: GrammarTokens) {
	insert(grammar, afterKey, tokens);
}

export function insert (
	grammar: Grammar,
	atKey: string,
	insert: GrammarTokens,
	position: 'before' | 'after' = 'after'
) {
	if (!(atKey in grammar)) {
		// TODO support deep keys
		throw new Error(`"${atKey}" has to be a key of grammar.`);
	}

	const descriptors = Object.getOwnPropertyDescriptors(grammar);

	// delete all keys in `grammar`
	for (const key in descriptors) {
		if (Object.hasOwn(descriptors, key)) {
			delete grammar[key];
		}
	}

	// insert keys again
	for (const key in descriptors) {
		if (position === 'before' && key === atKey) {
			betterAssign(grammar, insert);
		}

		// Do not insert tokens which also occur in `insert`. See #1525
		if (!Object.hasOwn(insert, key)) {
			Object.defineProperty(grammar, key, descriptors[key]);
		}

		if (position === 'after' && key === atKey) {
			betterAssign(grammar, insert);
		}
	}
}
