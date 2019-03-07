"use strict";


module.exports = {
	/**
	 * @typedef TokenStreamItem
	 * @property {string} type
	 * @property {string | TokenStreamItem | Array.<string|TokenStreamItem>} content
	*/

	/**
	 * Simplifies the token stream to ease the matching with the expected token stream.
	 *
	 * * Strings are kept as-is
	 * * In arrays each value is transformed individually
	 * * Values that are empty (empty arrays or strings only containing whitespace)
	 *
	 *
	 * @param {string | TokenStreamItem | Array.<string|TokenStreamItem>} tokenStream
	 * @returns {string | Array.<string|Array.<string|Array>>}
	 */
	simplify(tokenStream) {
		if (Array.isArray(tokenStream)) {
			return tokenStream
				.map(value => this.simplify(value))
				.filter(value => {
					return !(Array.isArray(value) && !value.length) && !(typeof value === "string" && !value.trim().length);
				});
		}
		else if (typeof tokenStream === "object") {
			return [tokenStream.type, this.simplify(tokenStream.content)];
		}
		else {
			return tokenStream;
		}
	}
};
