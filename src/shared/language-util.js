import { rest, tokenize } from './symbols';

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
 * @param {import("../types").Grammar} grammar The grammar to be modified.
 * @param {string} before The key to insert before.
 * @param {import("../types").GrammarTokens} insert An object containing the key-value pairs to be inserted.
 */
export function insertBefore(grammar, before, insert) {
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
 * @param {import("../types").Grammar} grammar The grammar of the language to extend.
 * @param {string} id The id of the language to extend.
 * @param {import("../types").Grammar} reDef The new tokens to append.
 * @returns {import("../types").Grammar} The new language created.
 * @public
 * @example
 * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
 *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
 *     // at its original position
 *     'comment': { ... },
 *     // CSS doesn't have a 'color' token, so this token will be appended
 *     'color': /\b(?:red|green|blue)\b/
 * });
 */
export function extend(grammar, id, reDef) {
	const lang = cloneGrammar(grammar, id);

	for (const key in reDef) {
		lang[key] = reDef[key];
	}

	return lang;
}

/**
 *
 * @param {import('../types').Grammar} grammar
 * @param {string} id
 * @returns {import('../types').Grammar}
 */
function cloneGrammar(grammar, id) {
	/** @type {import('../types').Grammar} */
	const result = {};

	/** @type {Map<import('../types').Grammar, import('../types').Grammar>} */
	const visited = new Map();

	/**
	 * @param {import('../types').GrammarToken | RegExp} value
	 */
	function cloneToken(value) {
		if (value.exec) {
			return value;
		} else {
			/** @type {import('../types').GrammarToken} */
			const copy = { pattern: value.pattern };
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
	/**
	 * @param {import('../types').GrammarTokens[string]} value
	 */
	function cloneTokens(value) {
		if (!value) {
			return undefined;
		} else if (Array.isArray(value)) {
			return value.map(cloneToken);
		} else {
			return cloneToken(value);
		}
	}
	/**
	 * @param {NonNullable<import('../types').Grammar[rest]>} ref
	 */
	function cloneRef(ref) {
		if (ref === id) {
			// self ref
			return result;
		} else if (typeof ref === 'string') {
			return ref;
		} else {
			return clone(ref);
		}
	}
	/**
	 * @param {import('../types').Grammar} value
	 */
	function clone(value) {
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

/**
 * @param {import('../types').Grammar} grammar
 * @returns {import('../types').Grammar}
 */
export function withoutTokenize(grammar) {
	if (!grammar[tokenize]) {
		return grammar;
	}

	const copy = { ...grammar };
	delete copy[tokenize];
	return copy;
}
