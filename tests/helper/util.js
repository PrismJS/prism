const { RegExpParser } = require('regexpp');


/**
 * @typedef {import("regexpp/ast").Pattern} Pattern
 * @typedef {import("regexpp/ast").Flags} Flags
 * @typedef {{ pattern: Pattern, flags: Flags }} LiteralAST
 */


const parser = new RegExpParser();
/** @type {Map<string, LiteralAST>} */
const astCache = new Map();


module.exports = {

	/**
	 * Performs a breadth-first search on the given start element.
	 *
	 * @param {any} start
	 * @param {(path: { key: string, value: any }[]) => void} callback
	 */
	BFS(start, callback) {
		const visited = new Set();
		/** @type {{ key: string, value: any }[][]} */
		let toVisit = [
			[{ key: null, value: start }]
		];

		callback(toVisit[0]);

		while (toVisit.length > 0) {
			/** @type {{ key: string, value: any }[][]} */
			const newToVisit = [];

			for (const path of toVisit) {
				const obj = path[path.length - 1].value;
				if (!visited.has(obj)) {
					visited.add(obj);

					for (const key in obj) {
						const value = obj[key];

						path.push({ key, value });
						callback(path);

						if (Array.isArray(value) || Object.prototype.toString.call(value) == '[object Object]') {
							newToVisit.push([...path]);
						}

						path.pop();
					}
				}
			}

			toVisit = newToVisit;
		}
	},

	/**
	 * Returns the AST of a given pattern.
	 *
	 * @param {RegExp} regex
	 * @returns {LiteralAST}
	 */
	parseRegex(regex) {
		const key = regex.toString();
		let literal = astCache.get(key);
		if (literal === undefined) {
			const flags = parser.parseFlags(regex.flags, undefined);
			const pattern = parser.parsePattern(regex.source, undefined, undefined, flags.unicode);
			literal = { pattern, flags };
			astCache.set(key, literal);
		}
		return literal;
	}

};
