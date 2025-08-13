export class Token {
	/**
	 * The type of the token.
	 *
	 * This is usually the key of a pattern in a {@link Grammar}.
	 *
	 * @see {@link GrammarToken}
	 * @type {TokenName}
	 */
	type;

	/**
	 * The strings or tokens contained by this token.
	 *
	 * This will be a token stream if the pattern matched also defined an `inside` grammar.
	 *
	 * @type {string | TokenStream}
	 */
	content;

	/**
	 * The alias(es) of the token.
	 *
	 * @see {@link GrammarToken#alias}
	 * @type {TokenName | TokenName[] | undefined}
	 */
	alias;

	/**
	 * Length of the full string this token was created from.
	 *
	 * Only used internally. The API does not guarantee that this field has any particular value or meaning.
	 *
	 * @internal
	 * @type {number}
	 */
	length;

	/**
	 * Creates a new token.
	 *
	 * @param {TokenName} type
	 * @param {string | TokenStream} content
	 * @param {TokenName | TokenName[]} [alias]
	 * @param {string} [matchedStr='']
	 */
	constructor (type, content, alias, matchedStr = '') {
		this.type = type;
		this.content = content;
		this.alias = alias;
		this.length = matchedStr.length;
	}

	/**
	 * Adds the given alias to the list of aliases of this token.
	 *
	 * @param {TokenName} alias
	 * @returns {void}
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
 * @typedef {import('../../types.d.ts').TokenName} TokenName
 * @typedef {import('../../types.d.ts').TokenStream} TokenStream
 */
