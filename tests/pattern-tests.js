"use strict";

const { assert } = require('chai');
const PrismLoader = require('./helper/prism-loader');
const { BFS, parseRegex } = require('./helper/util');
const { languages } = require('../components');
const { visitRegExpAST } = require('regexpp');


/**
 * @typedef {import("./helper/util").LiteralAST} LiteralAST
 * @typedef {import("regexpp/ast").Element} Element
 */


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
	 * _Note:_ This will aggregate all errors thrown by the given callback and throw an aggregated error at the end
	 * of the iteration. You can also append any number of errors per callback using the `reportError` function.
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
	 * @property {(message: string) => void} reportError
	 */
	function forEachPattern(callback) {
		const errors = [];

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
				try {
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
						path,
						reportError: message => errors.push(message)
					});
				} catch (error) {
					errors.push(error);
				}
			}
		});

		if (errors.length > 0) {
			throw new Error(errors.map(e => String(e.message || e)).join('\n\n'));
		}
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

	it('- should not have lookbehind groups with 0 as their only possible index', function () {
		/**
		 * Returns whether the given element will have zero length meaning that it doesn't extend the matched string.
		 *
		 * @param {Element} element
		 * @returns {boolean}
		 */
		function isZeroLength(element) {
			switch (element.type) {
				case 'Assertion':
					// assertions == ^, $, \b, lookarounds
					return true;
				case 'Quantifier':
					return element.max === 0 || isZeroLength(element.element);
				case 'CapturingGroup':
				case 'Group':
					// every element in every alternative has to be of zero length
					return element.alternatives.every(alt => alt.elements.every(isZeroLength));
				case 'Backreference':
					// on if the group referred to is of zero length
					return isZeroLength(element.resolved);
				default:
					return false; // what's left are characters
			}
		}

		/**
		 * Returns whether the given element will always match the start of the string.
		 *
		 * @param {Element} element
		 * @returns {boolean}
		 */
		function isFirstMatch(element) {
			const parent = element.parent;
			switch (parent.type) {
				case 'Alternative':
					// all elements before this element have to of zero length
					if (!parent.elements.slice(0, parent.elements.indexOf(element)).every(isZeroLength)) {
						return false;
					}
					const grandParent = parent.parent;
					if (grandParent.type === 'Pattern') {
						return true;
					} else {
						return isFirstMatch(grandParent);
					}

				case 'Quantifier':
					if (parent.max === null /* null == open ended */ || parent.max >= 2) {
						return false;
					} else {
						return isFirstMatch(parent);
					}

				default:
					throw new Error(`Internal error: The given node should not be a '${element.type}'.`);
			}
		}

		forEachPattern(({ ast, tokenPath, name, parent }) => {
			const lookbehind = name === 'pattern' && parent.lookbehind;

			if (!lookbehind) {
				return;
			}

			let first = true;
			visitRegExpAST(ast.pattern, {
				onCapturingGroupEnter(node) {
					if (!first) {
						return;
					}

					if (!isFirstMatch(node)) {
						assert.fail(`Token ${tokenPath}: The lookbehind group (if matched at all) always has to be at index 0 relative to the whole match.`);
					}

					first = false;
				}
			});
		});
	});

	it('- should not have unused capturing groups', function () {
		forEachPattern(({ ast, tokenPath, name, parent, reportError }) => {
			const lookbehind = name === 'pattern' && parent.lookbehind;

			let first = true;
			visitRegExpAST(ast.pattern, {
				onCapturingGroupEnter(node) {
					if (node.references.length === 0 && !(lookbehind && first)) {
						reportError(`Token ${tokenPath}: Unused capturing group ${node.raw}. All capturing groups have to be either referenced or used as a Prism lookbehind group.`);
					}

					first = false;
				}
			});
		});
	});

}
