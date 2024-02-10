import { rest, tokenize } from './symbols';
import type { Grammar, GrammarToken, GrammarTokens, RegExpLike } from '../types';

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
export function insertBefore(grammar: Grammar, before: string, insert: GrammarTokens) {
	if (!(before in grammar)) {
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
 * @param grammar The grammar of the language to extend.
 * @param id The id of the language to extend.
 * @param reDef The new tokens to append.
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
export function extend(grammar: Grammar, id: string, reDef: Grammar): Grammar {
	const lang = cloneGrammar(grammar, id);

	for (const key in reDef) {
		lang[key] = reDef[key];
	}

	return lang;
}

function cloneGrammar(grammar: Grammar, id: string): Grammar {
	const result: Grammar = {};

	const visited = new Map<Grammar, Grammar>();

	function cloneToken(value: GrammarToken | RegExpLike) {
		if (!value.pattern) {
			return value;
		} else {
			const copy: GrammarToken = { pattern: value.pattern };
			if (value.lookbehind) {
				copy.lookbehind = value.lookbehind;
			}
			if (value.greedy) {
				copy.greedy = value.greedy;
			}
			if (value.alias) {
				copy.alias = Array.isArray(value.alias) ? [...value.alias] : value.alias;
			}
			if (value.inside) {
				copy.inside = cloneRef(value.inside);
			}
			return copy;
		}
	}
	function cloneTokens(value: GrammarTokens[string]) {
		if (!value) {
			return undefined;
		} else if (Array.isArray(value)) {
			return value.map(cloneToken);
		} else {
			return cloneToken(value);
		}
	}
	function cloneRef(ref: NonNullable<Grammar[typeof rest]>) {
		if (ref === id) {
			// self ref
			return result;
		} else if (typeof ref === 'string') {
			return ref;
		} else {
			return clone(ref);
		}
	}
	function clone(value: Grammar) {
		let mapped = visited.get(value);
		if (mapped === undefined) {
			mapped = value === grammar ? result : {};
			visited.set(value, mapped);

			// tokens
			for (const [key, tokens] of Object.entries(value)) {
				mapped[key] = cloneTokens(tokens);
			}

			// rest
			const r = value[rest];
			if (r != null) {
				mapped[rest] = cloneRef(r);
			}

			// tokenize
			const t = value[tokenize];
			if (t) {
				mapped[tokenize] = t;
			}
		}
		return mapped;
	}

	return clone(grammar);
}

export function withoutTokenize(grammar: Grammar): Grammar {
	if (!grammar[tokenize]) {
		return grammar;
	}

	const copy = { ...grammar };
	delete copy[tokenize];
	return copy;
}
