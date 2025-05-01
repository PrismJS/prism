import { deepClone, deepMerge } from '../util/objects';
import type { Grammar, GrammarToken, GrammarTokens, PlainObject, RegExpLike } from '../types';

// TODO: Update documentation

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

/**
 * Creates a deep copy of the language with the given id and appends the given tokens.
 *
 * If a token in `reDef` also appears in the copied language, then the existing token in the copied language
 * will be overwritten at its original position.
 *
 * ## Best practices
 *
 * Since the position of overwriting tokens (token in `reDef` that overwrite tokens in the copied language)
 * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
 * understand the language definition because, normally, the order of tokens matters in Prism grammars.
 *
 * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
 * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
 *
 * @param base The grammar of the language to extend.
 * @param id The id of the language to extend.
 * @param grammar The new tokens to append.
 * @returns The new language created.
 * @example
 * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
 *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
 *     // at its original position
 *     'comment': { ... },
 *     // CSS doesn't have a 'color' token, so this token will be appended
 *     'color': /\b(?:red|green|blue)\b/
 * });
 */
export function extend (base: Grammar, id: string, grammar: Grammar): Grammar {
	const lang = deepClone(base, id);

	for (const key in grammar) {
		if (typeof key !== 'string' || key.startsWith('$')) {
			// ignore special keys
			continue;
		}

		lang[key] = grammar[key];
	}

	if (grammar.$insertBefore) {
		lang.$insertBefore = Object.assign(lang.$insertBefore ?? {}, grammar.$insertBefore);
	}

	if (grammar.$delete) {
		if (lang.$delete) {
			// base also had $delete
			lang.$delete.push(...grammar.$delete);
		}
		else {
			lang.$delete = [...grammar.$delete];
		}
	}

	if (grammar.$merge) {
		lang.$merge = Object.assign(lang.$merge ?? {}, grammar.$merge);
	}

	return lang;
}

export function resolveGrammar (grammar: Grammar) {
	if (grammar.$insertBefore) {
		for (const key in grammar.$insertBefore) {
			const tokens = grammar.$insertBefore[key];
			if (tokens) {
				insertBefore(grammar, key, tokens as GrammarTokens);
			}
		}
		delete grammar.$insertBefore;
	}

	if (grammar.$delete) {
		for (const key of grammar.$delete) {
			// TODO support deep keys
			delete grammar[key as string];
		}
		delete grammar.$delete;
	}

	if (grammar.$merge) {
		for (const key in grammar.$merge) {
			const tokens = grammar.$merge[key];

			if (grammar[key]) {
				deepMerge(grammar[key] as PlainObject, tokens as PlainObject);
			}
			else {
				grammar[key] = tokens;
			}
		}

		delete grammar.$merge;
	}

	return grammar;
}

export function withoutTokenize (grammar: Grammar): Grammar {
	if (!grammar.$tokenize) {
		return grammar;
	}

	const copy = { ...grammar };
	delete copy.$tokenize;
	return copy;
}
