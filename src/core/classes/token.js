export class Token {
	/**
	 * The type of the token.
	 *
	 * This is usually the key of a pattern in a {@link Grammar}.
	 *
	 * @see {@link GrammarToken}
	 */
	type;

	/**
	 * The strings or tokens contained by this token.
	 *
	 * This will be a token stream if the pattern matched also defined an `inside` grammar.
	 */
	content;

	/**
	 * The alias(es) of the token.
	 *
	 * @see {@link GrammarToken#alias}
	 */
	alias;

	/**
	 * Length of the full string this token was created from.
	 *
	 * Only used internally. The API does not guarantee that this field has any particular value or meaning.
	 *
	 * @internal
	 */
	length;

	/**
	 * Creates a new token.
	 */
	constructor (type, content, alias, matchedStr = '') {
		this.type = type;
		this.content = content;
		this.alias = alias;
		this.length = matchedStr.length;
	}

	/**
	 * Adds the given alias to the list of aliases of this token.
	 */
	addAlias (alias) {
		let aliases = this.alias;
		if (!aliases) {
			this.alias = aliases = [];
		}
		else if (!Array.isArray(aliases)) {
			this.alias = aliases = [aliases];
		}
		aliases.push(alias);
	}
}

export default Token;

/**
 * Returns the text content of the given token or token stream.
 *
 * @param {string | Token | TokenStream} token
 * @returns {string}
 */
export function getTextContent (token) {
	if (typeof token === 'string') {
		return token;
	}
	else if (Array.isArray(token)) {
		return token.map(getTextContent).join('');
	}
	else {
		return getTextContent(token.content);
	}
}

/**
 * @typedef {import('./token.d.ts').Token} Token
 * @typedef {import('./token.d.ts').TokenStream} TokenStream
 */
