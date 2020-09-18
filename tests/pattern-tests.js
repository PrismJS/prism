"use strict";

const { assert } = require('chai');
const PrismLoader = require('./helper/prism-loader');
const { BFS, parseRegex } = require('./helper/util');
const { languages } = require('../components.json');
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

			let tokenPath = 'Prism.languages';
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

	/**
	 * Returns whether the given element will always at the start of the whole match.
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


	it('- should not match the empty string', function () {
		forEachPattern(({ pattern, tokenPath }) => {
			// test for empty string
			assert.notMatch('', pattern, `${tokenPath}: ${pattern} should not match the empty string.\n\n`
				+ `Patterns that do match the empty string can potentially cause infinitely many empty tokens. `
				+ `Make sure that all patterns always consume at least one character.`);
		});
	});

	it('- should have a capturing group if lookbehind is set to true', function () {
		forEachPattern(({ ast, tokenPath, lookbehind }) => {
			if (lookbehind) {
				let hasCapturingGroup = false;
				forEachCapturingGroup(ast.pattern, () => { hasCapturingGroup = true; });

				if (!hasCapturingGroup) {
					assert.fail(`${tokenPath}: The pattern is set to 'lookbehind: true' but does not have a capturing group.\n\n`
						+ `Prism lookbehind groups use the captured text of the first capturing group to simulate a lookbehind. `
						+ `Without a capturing group, a lookbehind is not possible.\n`
						+ `To fix this, either add a capturing group for the lookbehind or remove the 'lookbehind' property.`);
				}
			}
		});
	});

	it('- should not have lookbehind groups that can be preceded by other some characters', function () {
		forEachPattern(({ ast, tokenPath, lookbehind }) => {
			if (!lookbehind) {
				return;
			}
			forEachCapturingGroup(ast.pattern, ({ group, number }) => {
				if (number === 1 && !isFirstMatch(group)) {
					assert.fail(`${tokenPath}: The lookbehind group ${group.raw} might be preceded by some characters.\n\n`
						+ `Prism assumes that the lookbehind group, if captured, is the first thing matched by the regex. `
						+ `If characters might precede the lookbehind group (e.g. /a?(b)c/), then Prism cannot correctly apply the lookbehind correctly in all cases.\n`
						+ `To fix this, either remove the preceding characters or include them in the lookbehind group.`);
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
					reportError(`${tokenPath}: The lookbehind group ${group.raw} does not consume characters.\n\n`
						+ `Therefor it is not necessary to use a lookbehind group.\n`
						+ `To fix this, replace the lookbehind group with ${replacement} and remove the 'lookbehind' property.`);
				}
			});
		});
	});

	it('- should not have unused capturing groups', function () {
		forEachPattern(({ ast, tokenPath, lookbehind, reportError }) => {
			forEachCapturingGroup(ast.pattern, ({ group, number }) => {
				const isLookbehindGroup = lookbehind && number === 1;
				if (group.references.length === 0 && !isLookbehindGroup) {
					const fixes = [];
					fixes.push(`Make this group a non-capturing group ('(?:...)' instead of '(...)'). (It's usually this option.)`);
					fixes.push(`Reference this group with a backreference (use '\\${number}' for this).`);
					if (number === 1 && !lookbehind) {
						if (isFirstMatch(group)) {
							fixes.push(`Add a 'lookbehind: true' declaration.`);
						} else {
							fixes.push(`Add a 'lookbehind: true' declaration. (This group is not a valid lookbehind group because it can be preceded by some characters.)`);
						}
					}

					reportError(`${tokenPath}: Unused capturing group ${group.raw}.\n\n`
						+ `Unused capturing groups generally degrade the performance of regular expressions. `
						+ `They might also be a sign that a backreference is incorrect or that a 'lookbehind: true' declaration in missing.\n`
						+ `To fix this, do one of the following:\n`
						+ fixes.map(f => '- ' + f).join('\n'));
				}
			});
		});
	});

	it('- should have nice names and aliases', function () {
		const niceName = /^[a-z][a-z\d]*(?:[-_][a-z\d]+)*$/;
		function testName(name, desc = 'token name') {
			if (!niceName.test(name)) {
				assert.fail(`The ${desc} '${name}' does not match ${niceName}.\n\n`
					+ `To fix this, choose a name that matches the above regular expression.`);
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
						reportError(`${tokenPath}: Octal escape ${node.raw}.\n\n`
							+ `Octal escapes can be confused with backreferences, so please do not use them.\n`
							+ `To fix this, use a different escape method. `
							+ `Note that this could also be an invalid backreference, so be sure to carefully analyse the pattern.`);
					}
				}
			});
		});
	});

}
