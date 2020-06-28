"use strict";


module.exports = {
	/**
	 * @typedef TokenStreamItem
	 * @property {string} type
	 * @property {string | Array<string|TokenStreamItem>} content
	 *
	 * @typedef {Array<string | [string, string | Array]>} SimplifiedTokenStream
	 */

	/**
	 * Simplifies the token stream to ease the matching with the expected token stream.
	 *
	 * * Strings are kept as-is
	 * * In arrays each value is transformed individually
	 * * Values that are empty (empty arrays or strings only containing whitespace)
	 *
	 * @param {Array<string|TokenStreamItem>} tokenStream
	 * @returns {SimplifiedTokenStream}
	 */
	simplify: function simplify(tokenStream) {
		return tokenStream
			.map(innerSimple)
			.filter((value, i, arr) => {
				if (typeof value === "string" && !value.trim().length) {
					// string contains only spaces
					if (i > 0 && i < arr.length - 1 && value.split(/\r\n?|\n/g).length > 2) {
						// in a valid token stream there are no adjacent strings, so we know that the previous
						// element is a (simplified) token
						arr[i - 1]['newline-after'] = true;
					}
					return false;
				}
				return true;
			});

		/**
		 * @param {string | TokenStreamItem} value
		 * @returns {string | [string, string | Array]}
		 */
		function innerSimple(value) {
			if (typeof value === "object") {
				if (Array.isArray(value.content)) {
					return [value.type, simplify(value.content)];
				} else {
					return [value.type, value.content];
				}
			} else {
				return value;
			}
		}
	},

	/**
	 *
	 * @param {Readonly<SimplifiedTokenStream>} tokenStream
	 * @param {number} [indentationLevel]
	 */
	prettyprint(tokenStream, indentationLevel = 1) {
		const indentChar = '    ';

		// can't use tabs because the console will convert one tab to four spaces
		const indentation = new Array(indentationLevel + 1).join(indentChar);

		let out = "";
		out += "[\n"
		tokenStream.forEach((item, i) => {
			out += indentation;
			let extraNewline = false;

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

				extraNewline = !!item['newline-after'];
			}

			const lineEnd = (i === tokenStream.length - 1) ? '\n' : ',\n';
			out += lineEnd;

			if (extraNewline) {
				out += '\n';
			}
		})
		out += indentation.substr(indentChar.length) + ']'
		return out;
	}
};
