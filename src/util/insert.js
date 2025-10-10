import { betterAssign } from './objects.js';

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
 * @param {Grammar} grammar The grammar to be modified.
 * @param {string} beforeKey The key to insert before.
 * @param {GrammarTokens} tokens An object containing the key-value pairs to be inserted.
 */
export function insertBefore (grammar, beforeKey, tokens) {
	insert(grammar, beforeKey, tokens, 'before');
}

/**
 *
 * @param {Grammar} grammar
 * @param {string} afterKey
 * @param {GrammarTokens} tokens
 */
export function insertAfter (grammar, afterKey, tokens) {
	insert(grammar, afterKey, tokens);
}

/**
 *
 * @param {Grammar} grammar
 * @param {string} atKey
 * @param {GrammarTokens} insert
 * @param {'before' | 'after'} [position='after']
 */
export function insert (grammar, atKey, insert, position = 'after') {
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

/**
 * @typedef {import('../types.d.ts').Grammar} Grammar
 * @typedef {import('../types.d.ts').GrammarToken} GrammarToken
 * @typedef {import('../types.d.ts').GrammarTokens} GrammarTokens
 */
