"use strict";

const { assert } = require('chai');
const PrismLoader = require('./helper/prism-loader');
const { BFS, parseRegex } = require('./helper/util');
const { languages } = require('../components');
const { visitRegExpAST } = require('regexpp');


for (const lang in languages) {
	if (lang === 'meta') {
		continue;
	}

	describe(`Patterns of '${lang}'`, function () {
		const Prism = PrismLoader.createInstance(lang);
		testPatterns(Prism);
	});

	function toArray(value) {
		if (Array.isArray(value)) {
			return value;
		} else if (value != null) {
			return [value];
		} else {
			return [];
		}
	}

	let optional = toArray(languages[lang].optional);
	let modify = toArray(languages[lang].modify);

	if (optional.length > 0 || modify.length > 0) {
		let name = `Patterns of '${lang}'`;
		if (optional.length > 0) {
			name += ` + optional dependencies '${optional.join("', '")}'`;
		}
		if (modify.length > 0) {
			name += ` + modify dependencies '${modify.join("', '")}'`;
		}

		describe(name, function () {
			const Prism = PrismLoader.createInstance([...optional, ...modify, lang]);
			testPatterns(Prism);
		});
	}
}

/**
 * Tests all patterns in the given Prism instance.
 *
 * @param {any} Prism
 *
 * @typedef {import("./helper/util").LiteralAST} LiteralAST
 * @typedef {import("regexpp/ast").Element} Element
 * @typedef {import("regexpp/ast").Pattern} Pattern
 */
function testPatterns(Prism) {

	/**
	 * Invokes the given function on every pattern in `Prism.languages`.
	 *
	 * _Note:_ This will aggregate all errors thrown by the given callback and throw an aggregated error at the end
	 * of the iteration. You can also append any number of errors per callback using the `reportError` function.
	 *
	 * @param {(values: ForEachPatternCallbackValue) => void} callback
	 *
	 * @typedef ForEachPatternCallbackValue
	 * @property {RegExp} pattern
	 * @property {LiteralAST} ast
	 * @property {string} tokenPath
	 * @property {string} name
	 * @property {any} parent
	 * @property {boolean} lookbehind Whether the first capturing group of the pattern is a Prism lookbehind group.
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

					const parent = path.length > 1 ? path[path.length - 2].value : undefined;
					callback({
						pattern: value,
						ast,
						tokenPath,
						name: key,
						parent,
						path,
						lookbehind: key === 'pattern' && parent && !!parent.lookbehind,
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

	/**
	 * Invokes the given callback for all capturing groups in the given pattern in left to right order.
	 *
	 * @param {Pattern} pattern
	 * @param {(values: ForEachCapturingGroupCallbackValue) => void} callback
	 *
	 * @typedef ForEachCapturingGroupCallbackValue
	 * @property {import("regexpp/ast").CapturingGroup} group
	 * @property {number} number Note: Starts at 1.
	 */
	function forEachCapturingGroup(pattern, callback) {
		let number = 0;
		visitRegExpAST(pattern, {
			onCapturingGroupEnter(node) {
				callback({
					group: node,
					number: ++number
				});
			}
		});
	}

	/**
	 * Returns whether the given element will always have zero width meaning that it doesn't consume characters.
	 *
	 * @param {Element} element
	 * @returns {boolean}
	 */
	function isAlwaysZeroWidth(element) {
		switch (element.type) {
			case 'Assertion':
				// assertions == ^, $, \b, lookarounds
				return true;
			case 'Quantifier':
				return element.max === 0 || isAlwaysZeroWidth(element.element);
			case 'CapturingGroup':
			case 'Group':
				// every element in every alternative has to be of zero length
				return element.alternatives.every(alt => alt.elements.every(isAlwaysZeroWidth));
			case 'Backreference':
				// on if the group referred to is of zero length
				return isAlwaysZeroWidth(element.resolved);
			default:
				return false; // what's left are characters
		}
	}


	it('- should not match the empty string', function () {
		forEachPattern(({ pattern, tokenPath }) => {
			// test for empty string
			assert.notMatch('', pattern, `Token ${tokenPath}: ${pattern} should not match the empty string.`);
		});
	});

	it('- should have a capturing group if lookbehind is set to true', function () {
		forEachPattern(({ ast, tokenPath, lookbehind }) => {
			if (lookbehind) {
				let hasCapturingGroup = false;
				forEachCapturingGroup(ast.pattern, () => { hasCapturingGroup = true; });

				if (!hasCapturingGroup) {
					assert.fail(`Token ${tokenPath}: The pattern is set to 'lookbehind: true' but does not have a capturing group.`);
				}
			}
		});
	});

	it('- should not have lookbehind groups that can be preceded by other some characters', function () {
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
					if (!parent.elements.slice(0, parent.elements.indexOf(element)).every(isAlwaysZeroWidth)) {
						return false;
					}
					const grandParent = parent.parent;
					if (grandParent.type === 'Pattern') {
						return true;
					} else {
						return isFirstMatch(grandParent);
					}

				case 'Quantifier':
					if (parent.max >= 2) {
						return false;
					} else {
						return isFirstMatch(parent);
					}

				default:
					throw new Error(`Internal error: The given node should not be a '${element.type}'.`);
			}
		}

		forEachPattern(({ ast, tokenPath, lookbehind }) => {
			if (!lookbehind) {
				return;
			}
			forEachCapturingGroup(ast.pattern, ({ group, number }) => {
				if (number === 1 && !isFirstMatch(group)) {
					assert.fail(`Token ${tokenPath}: `
						+ `The lookbehind group (if matched) always has to be at index 0 relative to the whole match.`);
				}
			});
		});
	});

	it('- should not have lookbehind groups that only have zero-width alternatives', function () {
		forEachPattern(({ ast, tokenPath, lookbehind, reportError }) => {
			if (!lookbehind) {
				return;
			}
			forEachCapturingGroup(ast.pattern, ({ group, number }) => {
				if (number === 1 && isAlwaysZeroWidth(group)) {
					const groupContent = group.raw.substr(1, group.raw.length - 2);
					const replacement = group.alternatives.length === 1 ? groupContent : `(?:${groupContent})`;
					reportError(`Token ${tokenPath}: The lookbehind group ${group.raw} does not consume characters. `
						+ `Therefor it is not necessary to use a lookbehind group. `
						+ `Replacing the lookbehind group with: ${replacement}`);
				}
			});
		});
	});

	it('- should not have unused capturing groups', function () {
		forEachPattern(({ ast, tokenPath, lookbehind, reportError }) => {
			forEachCapturingGroup(ast.pattern, ({ group, number }) => {
				const isLookbehindGroup = lookbehind && number === 1;
				if (group.references.length === 0 && !isLookbehindGroup) {
					reportError(`Token ${tokenPath}: Unused capturing group ${group.raw}. All capturing groups have to be either referenced or used as a Prism lookbehind group.`);
				}
			});
		});
	});

	it('- should have nice names and aliases', function () {
		const niceName = /^[a-z][a-z\d]*(?:[-_][a-z\d]+)*$/;
		function testName(name, desc = 'token name') {
			if (!niceName.test(name)) {
				assert.fail(`The ${desc} '${name}' does not match ${niceName}`);
			}
		}

		forEachPattern(({ name, parent, tokenPath, path }) => {
			// token name
			let offset = 1;
			if (name == 'pattern') { // regex can be inside an object
				offset++;
			}
			if (Array.isArray(path[path.length - 1 - offset].value)) { // regex/regex object can be inside an array
				offset++;
			}
			const patternName = path[path.length - offset].key;
			testName(patternName);

			// check alias
			if (name == 'pattern' && 'alias' in parent) {
				const alias = parent.alias;
				if (typeof alias === 'string') {
					testName(alias, `alias of '${tokenPath}'`);
				} else if (Array.isArray(alias)) {
					alias.forEach(name => testName(name, `alias of '${tokenPath}'`));
				}
			}
		});
	});

	it('- should not use octal escapes', function () {
		forEachPattern(({ ast, tokenPath, reportError }) => {
			visitRegExpAST(ast.pattern, {
				onCharacterEnter(node) {
					if (/^\\(?:[1-9]|\d{2,})$/.test(node.raw)) {
						reportError(`Token ${tokenPath}: Octal escape ${node.raw}.`);
					}
				}
			});
		});
	});

}
