import { deepClone, deepMerge } from './objects';
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
 * ## Special cases
 *
 * If the grammars of `grammar` and `insert` have tokens with the same name, the tokens in `grammar`'s grammar
 * will be ignored.
 *
 * This behavior can be used to insert tokens after `before`:
 *
 * ```js
 * insertBefore(markup, 'comment', {
 *     'comment': markup.comment,
 *     // tokens after 'comment'
 * });
 * ```
 *
 * @param grammar The grammar to be modified.
 * @param before The key to insert before.
 * @param insert An object containing the key-value pairs to be inserted.
 */
export function insertBefore (grammar: Grammar, before: string, insert: GrammarTokens) {
	if (!(before in grammar)) {
		// TODO support deep keys
		throw new Error(`"${before}" has to be a key of grammar.`);
	}

	const grammarEntries = Object.entries(grammar);

	// delete all keys in `grammar`
	for (const [key] of grammarEntries) {
		delete grammar[key];
	}

	// insert keys again
	for (const [key, value] of grammarEntries) {
		if (key === before) {
			for (const insertKey of Object.keys(insert)) {
				grammar[insertKey] = insert[insertKey];
			}
		}

		// Do not insert tokens which also occur in `insert`. See #1525
		if (!insert.hasOwnProperty(key)) {
			grammar[key] = value;
		}
	}
}
