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
 * @param {Grammar} grammar The grammar of the language to extend.
 * @param {string} id The id of the language to extend.
 * @param {Grammar} reDef The new tokens to append.
 * @returns {Grammar} The new language created.
 * @example
 * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
 *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
 *     // at its original position
 *     'comment': { ... },
 *     // CSS doesn't have a 'color' token, so this token will be appended
 *     'color': /\b(?:red|green|blue)\b/
 * });
 */
export function extend (grammar, id, reDef) {
	const lang = cloneGrammar(grammar, id);

	for (const key in reDef) {
		lang[key] = reDef[key];
	}

	return lang;
}

/**
 * @param {Grammar} grammar
 * @param {string} id
 * @returns {Grammar}
 */
export function cloneGrammar (grammar, id) {
	/** @type {Grammar} */
	const result = {};

	/** @type {Map<Grammar, Grammar>} */
	const visited = new Map();

	/**
	 * @param {GrammarToken | RegExpLike} value
	 */
	function cloneToken (value) {
		if (!value.pattern) {
			return value;
		}
		else {
			/** @type {GrammarToken} */
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
	 * @param {GrammarTokens['string']} value
	 */
	function cloneTokens (value) {
		if (!value) {
			return undefined;
		}
		else if (Array.isArray(value)) {
			return value.map(cloneToken);
		}
		else {
			return cloneToken(value);
		}
	}

	/**
	 * @param {string | Grammar} ref
	 */
	function cloneRef (ref) {
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

	/**
	 * @param {Grammar} value
	 */
	function clone (value) {
		let mapped = visited.get(value);
		if (mapped === undefined) {
			mapped = value === grammar ? result : {};
			visited.set(value, mapped);

			// tokens
			for (const [key, tokens] of Object.entries(value)) {
				mapped[key] = cloneTokens(/** @type {GrammarToken[]} */ (tokens));
			}

			// rest
			const r = value.$rest;
			if (r != null) {
				mapped.$rest = cloneRef(r);
			}

			// tokenize
			const t = value.$tokenize;
			if (t) {
				mapped.$tokenize = t;
			}
		}
		return mapped;
	}

	return clone(grammar);
}

/**
 * @typedef {import('../types.d.ts').Grammar} Grammar
 * @typedef {import('../types.d.ts').GrammarToken} GrammarToken
 * @typedef {import('../types.d.ts').GrammarTokens} GrammarTokens
 * @typedef {import('../types.d.ts').RegExpLike} RegExpLike
 */
