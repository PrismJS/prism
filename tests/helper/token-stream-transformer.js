"use strict";


module.exports = {
	/**
	 * @typedef TokenStreamItem
	 * @property {string} type
	 * @property {string | TokenStreamItem | Array<string|TokenStreamItem>} content
	*/

	/**
	 * Simplifies the token stream to ease the matching with the expected token stream.
	 *
	 * * Strings are kept as-is
	 * * In arrays each value is transformed individually
	 * * Values that are empty (empty arrays or strings only containing whitespace)
	 *
	 * @param {string | TokenStreamItem | Array<string|TokenStreamItem>} tokenStream
	 * @returns {Array<string|Array<string|any[]>>}
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
	},

	/**
	 *
	 * @param {ReadonlyArray<string|ReadonlyArray<string|any[]>>} tokenStream
	 * @param {number} [indentationLevel=0]
	 */
	prettyprint(tokenStream, indentationLevel = 1) {
		const indentChar = '    ';

		// can't use tabs because the console will convert one tab to four spaces
		const indentation = new Array(indentationLevel + 1).join(indentChar);

		let out = "";
		out += "[\n"
		tokenStream.forEach((item, i) => {
			out += indentation;

			if (typeof item === 'string') {
				out += JSON.stringify(item);
			} else {
				const name = item[0];
				const content = item[1];

				out += '[' + JSON.stringify(name) + ', ';

				if (typeof content === 'string') {
					out += JSON.stringify(content);
				} else {
					out += this.prettyprint(content, indentationLevel + 1);
				}

				out += ']';
			}

			const lineEnd = (i === tokenStream.length - 1) ? '\n' : ',\n';
			out += lineEnd;
		})
		out += indentation.substr(indentChar.length) + ']'
		return out;
	}
};
