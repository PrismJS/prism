"use strict";

const { assert } = require('chai');
const PrismLoader = require('./helper/prism-loader');
const { languages } = require('../components');
const { RegExpParser, visitRegExpAST } = require('regexpp');


/**
 * @typedef {import("regexpp/ast").Pattern} Pattern
 * @typedef {import("regexpp/ast").Flags} Flags
 * @typedef {{ pattern: Pattern, flags: Flags }} LiteralAST
 */


/**
 * Performs a breadth-first search on the given start element.
 *
 * @param {any} start
 * @param {(path: { key: string, value: any }[]) => void} callback
 */
function BFS(start, callback) {
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
}

const parser = new RegExpParser({ strict: false, ecmaVersion: 5 });
/** @type {Map<string, LiteralAST>} */
const astCache = new Map();
/**
 * Returns the AST of a given pattern.
 *
 * @param {RegExp} regex
 * @returns {LiteralAST}
 */
function parseRegex(regex) {
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


for (const lang in languages) {
	if (lang === 'meta') {
		continue;
	}

	describe(`Patterns of '${lang}'`, function () {
		const Prism = PrismLoader.createInstance(lang);
		testPatterns(Prism);
	});

	/** @type {undefined | string | string[]} */
	let peerDeps = languages[lang].peerDependencies;
	peerDeps = !peerDeps ? [] : (Array.isArray(peerDeps) ? peerDeps : [peerDeps]);

	if (peerDeps.length > 0) {
		describe(`Patterns of '${lang}' + peer dependencies '${peerDeps.join("', '")}'`, function () {
			const Prism = PrismLoader.createInstance([...peerDeps, lang]);
			testPatterns(Prism);
		});
	}
}

function testPatterns(Prism) {

	/**
	 * Invokes the given function on every pattern in `Prism.languages`.
	 *
	 * @param {(values: CallbackValue) => void} callback
	 *
	 * @typedef CallbackValue
	 * @property {RegExp} pattern
	 * @property {LiteralAST} ast
	 * @property {string} tokenPath
	 * @property {string} name
	 * @property {any} parent
	 * @property {{ key: string, value: any }[]} path
	 */
	function forEachPattern(callback) {
		BFS(Prism.languages, path => {
			const { key, value } = path[path.length - 1];

			let tokenPath = '<languages>';
			for (const { key } of path) {
				if (!key) {
					// do nothing
				} else if (/^\d+$/.test(key)) {
					tokenPath += `[${key}]`;
				} else if (/^[a-z]\w*$/i.test(key)) {
					tokenPath += `.${key}`;
				} else {
					tokenPath += `[${JSON.stringify(key)}]`;
				}
			}

			if (Object.prototype.toString.call(value) == '[object RegExp]') {
				let ast;
				try {
					ast = parseRegex(value);
				} catch (error) {
					throw new SyntaxError(`Invalid RegExp at ${tokenPath}\n\n${error.message}`);
				}

				callback({
					pattern: value,
					ast,
					tokenPath,
					name: key,
					parent: path.length > 1 ? path[path.length - 2].value : undefined,
					path
				});
			}
		});
	}


	it('- should not match the empty string', function () {
		forEachPattern(({ pattern, tokenPath }) => {
			// test for empty string
			assert.notMatch('', pattern, `Token ${tokenPath}: ${pattern} should not match the empty string.`);
		});
	});

	it('- should have a capturing group if lookbehind is set to true', function () {
		forEachPattern(({ ast, tokenPath, name, parent }) => {
			const lookbehind = name === 'pattern' && parent.lookbehind;

			if (lookbehind) {
				let hasCapturingGroup = false;
				visitRegExpAST(ast.pattern, {
					onCapturingGroupEnter() {
						hasCapturingGroup = true;
					}
				});

				if (!hasCapturingGroup) {
					assert.fail(`Token ${tokenPath}: The pattern is set to 'lookbehind: true' but does not have a capturing group.`);
				}
			}
		});
	});

	it('- should not have unused capturing groups', function () {
		const errors = [];

		forEachPattern(({ ast, tokenPath, name, parent }) => {
			const lookbehind = name === 'pattern' && parent.lookbehind;

			let first = true;
			visitRegExpAST(ast.pattern, {
				onCapturingGroupEnter(node) {
					if (node.references.length === 0 && !(lookbehind && first)) {
						errors.push(`Token ${tokenPath}: Unused capturing group ${node.raw}`);
					}

					first = false;
				}
			});
		});

		if (errors.length > 0) {
			assert.fail(errors.join('\n\n'));
		}
	});

}
