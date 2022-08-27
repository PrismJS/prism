export class Token {
	/**
	 * Creates a new token.
	 *
	 * @param {string} type See {@link Token#type type}
	 * @param {string | TokenStream} content See {@link Token#content content}
	 * @param {string | string[]} [alias] The alias(es) of the token.
	 * @param {string} [matchedStr=""] A copy of the full string this token was created from.
	 * @public
	 */
	constructor(type, content, alias, matchedStr = '') {
		/**
		 * The type of the token.
		 *
		 * This is usually the key of a pattern in a {@link Grammar}.
		 *
		 * @type {string}
		 * @see GrammarToken
		 * @public
		 */
		this.type = type;
		/**
		 * The strings or tokens contained by this token.
		 *
		 * This will be a token stream if the pattern matched also defined an `inside` grammar.
		 *
		 * @type {string | TokenStream}
		 * @public
		 */
		this.content = content;
		/**
		 * The alias(es) of the token.
		 *
		 * @type {undefined | string | string[]}
		 * @see GrammarToken
		 * @public
		 */
		this.alias = alias;

		// Copy of the full string this token was created from
		this.length = matchedStr.length;
	}
}

/**
 * A token stream is an array of strings and {@link Token Token} objects.
 *
 * Token streams have to fulfill a few properties that are assumed by most functions (mostly internal ones) that process
 * them.
 *
 * 1. No adjacent strings.
 * 2. No empty strings.
 *
 *    The only exception here is the token stream that only contains the empty string and nothing else.
 *
 * @typedef {Array<string | Token>} TokenStream
 * @public
 */

/**
 * Returns the text content of the given token or token stream.
 *
 * @param {string | Token | TokenStream} token
 * @returns {string}
 */
export function getTextContent(token) {
	if (typeof token === 'string') {
		return token;
	} else if (Array.isArray(token)) {
		return token.map(getTextContent).join('');
	} else {
		return getTextContent(token.content);
	}
}
