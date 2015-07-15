"use strict";


module.exports = {
	/**
	 * Simplifies the token stream to ease the matching with the expected token stream
	 *
	 * @param {string} tokenStream
	 * @returns {Array.<string[]|Array>}
	 */
	simplify: function (tokenStream) {
		// First filter all top-level non-objects as non-objects are not-identified tokens
		//
		// we don't want to filter them in the lower levels as we want to support nested content-structures
		return tokenStream.filter(
			function (token) {
				return (typeof token === "object");
			}
		).map(this.simplifyRecursively.bind(this));
	},


	/**
	 * Walks the token stream and recursively simplifies it
	 *
	 * @private
	 * @param {Array|{type: string, content: *}|string} token
	 * @returns {Array|string}
	 */
	simplifyRecursively: function (token)
	{
		if (Array.isArray(token))
		{
			return token.map(this.simplifyRecursively.bind(this));
		}
		else if (typeof token === "object")
		{
			return [token.type, this.simplifyRecursively(token.content)];
		}
		else
		{
			return token;
		}
	}
};
