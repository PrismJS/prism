import { rest, tokenize } from './symbols';
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
	const lang = cloneGrammar(base, id);

	for (const key in grammar) {
		if (['$insertBefore', '$delete', '$merge'].includes(key)) {
			// ignore special keys
			continue;
		}

		lang[key] = grammar[key];
	}

	if (grammar.$insertBefore) {
		if (lang.$insertBefore) {
			// base also had $insertBefore
			Object.assign(lang.$insertBefore, grammar.$insertBefore);
		}
		else {
			lang.$insertBefore = { ...grammar.$insertBefore };
		}
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
		if (lang.$merge) {
			// base also had $merge
			Object.assign(lang.$merge, grammar.$merge);
		}
		else {
			lang.$merge = { ...grammar.$merge };
		}
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

/**
 * Recursively merges two objects.
 * If the objects have the same key, the value of the second object will be used.
 * If the value is an object, it will be merged recursively.
 * If the value is an array, it will be merged into a new array.
 * @param dest
 * @param source
 */
function deepMerge (dest: PlainObject, source: PlainObject) {
	if (dest === source) {
		return dest;
	}

	for (const key in source) {
		const value1 = dest[key];
		const value2 = source[key];

		if (value1 === undefined) {
			dest[key] = value2;
		}
		else if (value2 === undefined) {
			continue;
		}
		else if (Array.isArray(value1)) {
			if (Array.isArray(value2)) {
				dest[key] = [...value1, ...value2];
			}
			else {
				(dest[key] as unknown[]).push(value2);
			}
		}
		else if (typeof value1 === 'object' && typeof value2 === 'object' && value1 != null && value2 != null) {
			deepMerge(value1 as PlainObject, value2 as PlainObject);
		}
		else {
			dest[key] = value2;
		}
	}

	return dest;
}

export function cloneGrammar (grammar: Grammar, id: string): Grammar {
	const result: Grammar = {};

	const visited = new Map<Grammar, Grammar>();

	function cloneToken (value: GrammarToken | RegExpLike) {
		if (!value.pattern) {
			return value;
		}
		else {
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
	function cloneTokens (value: GrammarTokens[string]) {
		if (!value) {
			return undefined;
		}
		else if (Array.isArray(value)) {
			return (value as Array<RegExpLike | GrammarToken>).map(cloneToken);
		}
		else {
			return cloneToken(value as RegExpLike | GrammarToken);
		}
	}
	function cloneRef (ref: NonNullable<Grammar[typeof rest]>) {
		if (ref === id) {
			// self ref
			return result;
		}
		else if (typeof ref === 'string') {
			return ref;
		}
		else {
			return clone(ref);
		}
	}
	function clone (value: Grammar) {
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

export function withoutTokenize (grammar: Grammar): Grammar {
	if (!grammar[tokenize]) {
		return grammar;
	}

	const copy = { ...grammar };
	delete copy[tokenize];
	return copy;
}
