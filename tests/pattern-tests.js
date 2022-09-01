import { assert } from 'chai';
import { JS, NFA, Transformers, Words, combineTransformers, getIntersectionWordSets, isDisjointWith, transform } from 'refa';
import * as RAA from 'regexp-ast-analysis';
import { visitRegExpAST } from 'regexpp';
import * as scslre from 'scslre';
import { noop, toArray } from '../src/shared/util';
import * as args from './helper/args';
import { createInstance, getComponent, getLanguageIds } from './helper/prism-loader';
import { TestCaseFile, parseLanguageNames } from './helper/test-case';
import { loadAllTests } from './helper/test-discovery';
import { BFS, BFSPathToPrismTokenPath, parseRegex } from './helper/util';

/**
 * A map from language id to a list of code snippets in that language.
 *
 * @type {Map<string, string[]>}
 */
const testSnippets = new Map();
const testSuite = loadAllTests();
for (const [languageIdentifier, files] of testSuite) {
	const lang = parseLanguageNames(languageIdentifier).mainLanguage;
	let snippets = testSnippets.get(lang);
	if (snippets === undefined) {
		snippets = [];
		testSnippets.set(lang, snippets);
	}

	for (const file of files) {
		snippets.push(TestCaseFile.readFromFile(file).code);
	}
}

const argsLanguage = new Set(toArray(args.language));
for (const lang of getLanguageIds()) {
	if (argsLanguage.size > 0 && !argsLanguage.has(lang)) {
		continue;
	}

	describe(`Patterns of '${lang}'`, async () => {
		const Prism = await createInstance(lang);
		testPatterns(Prism, lang);
	});

	describe(`Patterns of '${lang}' with optional dependencies`, async () => {
		const component = await getComponent(lang);
		const optional = toArray(component.optional);

		if (optional.length === 0) {
			it('no optional dependencies', noop);
		} else {
			const Prism = await createInstance([lang, ...optional]);
			testPatterns(Prism, lang);
		}
	});
}

/**
 * Tests all patterns in the given Prism instance.
 *
 * @param {import('../src/core/prism').Prism} Prism
 * @param {string} mainLanguage
 *
 * @typedef {import("./helper/util").LiteralAST} LiteralAST
 * @typedef {import("regexpp/ast").CapturingGroup} CapturingGroup
 * @typedef {import("regexpp/ast").Element} Element
 * @typedef {import("regexpp/ast").Group} Group
 * @typedef {import("regexpp/ast").LookaroundAssertion} LookaroundAssertion
 * @typedef {import("regexpp/ast").Pattern} Pattern
 */
function testPatterns(Prism, mainLanguage) {

	/**
	 * Returns a list of relevant languages in the Prism instance.
	 *
	 * The list does not included readonly dependencies and aliases.
	 *
	 * @returns {string[]}
	 */
	function getRelevantLanguages() {
		return [mainLanguage];
	}

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
	 * @property {CapturingGroup | undefined} lookbehindGroup
	 * @property {import('./helper/util').PathItem[]} path
	 * @property {(message: string) => void} reportError
	 */
	function forEachPattern(callback) {
		const visited = new Set();
		/** @type {(Error | string)[]} */
		const errors = [];

		/**
		 * @param {import('../src/types').Grammar} grammar
		 * @param {string} rootStr
		 */
		function traverse(grammar, rootStr) {
			if (visited.has(grammar)) {
				return;
			}
			visited.add(grammar);

			BFS(grammar, path => {
				const { key, value } = path[path.length - 1];
				const tokenPath = BFSPathToPrismTokenPath(path, rootStr);
				visited.add(value);

				if (key && Object.prototype.toString.call(value) == '[object RegExp]') {
					try {
						let ast;
						try {
							ast = parseRegex(value);
						} catch (error) {
							throw new SyntaxError(`Invalid RegExp at ${tokenPath}\n\n${asError(error).message}`);
						}

						const parent = path.length > 1 ? path[path.length - 2].value : undefined;
						const lookbehind = key === 'pattern' && parent && !!parent.lookbehind;
						const lookbehindGroup = lookbehind ? getFirstCapturingGroup(ast.pattern) : undefined;
						callback({
							pattern: value,
							ast,
							tokenPath,
							name: key,
							parent,
							path,
							lookbehind,
							lookbehindGroup,
							reportError: message => errors.push(message)
						});
					} catch (error) {
						errors.push(asError(error));
					}
				}
			});
		}

		// static analysis
		for (const id of Prism.components['entries'].keys()) {
			const grammar = Prism.components.getLanguage(id);
			if (grammar) {
				traverse(grammar, id);
			}
		}

		// dynamic analysis
		for (const lang of getRelevantLanguages()) {
			const snippets = testSnippets.get(lang);
			const grammar = Prism.components.getLanguage(lang);

			const oldTokenize = Prism.tokenize;
			Prism.tokenize = function (code, grammar) {
				const result = oldTokenize.call(this, code, grammar);
				traverse(grammar, lang + ': <Unknown>');
				return result;
			};

			for (const snippet of (snippets || [])) {
				Prism.highlight(snippet, lang, { grammar });
			}

			Prism.tokenize = oldTokenize;
		}

		if (errors.length > 0) {
			throw new Error(errors.map(e => typeof e === 'string' ? e : e.message).join('\n\n'));
		}
	}

	/**
	 * Invokes the given callback for all capturing groups in the given pattern in left to right order.
	 *
	 * @param {Pattern} pattern
	 * @param {(values: ForEachCapturingGroupCallbackValue) => void} callback
	 *
	 * @typedef ForEachCapturingGroupCallbackValue
	 * @property {CapturingGroup} group
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


	it('- should not match the empty string', () => {
		forEachPattern(({ ast, pattern, tokenPath }) => {
			// test for empty string
			const empty = RAA.isPotentiallyZeroLength(ast.pattern.alternatives);
			assert.isFalse(empty, `${tokenPath}: ${pattern} should not match the empty string.\n\n`
				+ `Patterns that do match the empty string can potentially cause infinitely many empty tokens. `
				+ `Make sure that all patterns always consume at least one character.`);
		});
	});

	it('- should have a capturing group if lookbehind is set to true', () => {
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

	it('- should not have lookbehind groups that can be preceded by other some characters', () => {
		forEachPattern(({ tokenPath, lookbehindGroup }) => {
			if (lookbehindGroup && !isFirstMatch(lookbehindGroup)) {
				assert.fail(`${tokenPath}: The lookbehind group ${lookbehindGroup.raw} might be preceded by some characters.\n\n`
					+ `Prism assumes that the lookbehind group, if captured, is the first thing matched by the regex. `
					+ `If characters might precede the lookbehind group (e.g. /a?(b)c/), then Prism cannot correctly apply the lookbehind correctly in all cases.\n`
					+ `To fix this, either remove the preceding characters or include them in the lookbehind group.`);
			}
		});
	});

	it('- should not have lookbehind groups that only have zero-width alternatives', () => {
		forEachPattern(({ tokenPath, lookbehindGroup, reportError }) => {
			if (lookbehindGroup && RAA.isZeroLength(lookbehindGroup)) {
				const groupContent = lookbehindGroup.raw.substr(1, lookbehindGroup.raw.length - 2);
				const replacement = lookbehindGroup.alternatives.length === 1 ? groupContent : `(?:${groupContent})`;
				reportError(`${tokenPath}: The lookbehind group ${lookbehindGroup.raw} does not consume characters.\n\n`
					+ `Therefor it is not necessary to use a lookbehind group.\n`
					+ `To fix this, replace the lookbehind group with ${replacement} and remove the 'lookbehind' property.`);
			}
		});
	});

	it('- should not have unused capturing groups', () => {
		forEachPattern(({ ast, tokenPath, lookbehindGroup, reportError }) => {
			forEachCapturingGroup(ast.pattern, ({ group, number }) => {
				const isLookbehindGroup = group === lookbehindGroup;
				if (group.references.length === 0 && !isLookbehindGroup) {
					const fixes = [];
					fixes.push(`Make this group a non-capturing group ('(?:...)' instead of '(...)'). (It's usually this option.)`);
					fixes.push(`Reference this group with a backreference (use '\\${number}' for this).`);
					if (number === 1 && !lookbehindGroup) {
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

	it('- should have nice names and aliases', () => {
		const niceName = /^[a-z][a-z\d]*(?:-[a-z\d]+)*$/;
		/**
		 * @param {string} name
		 * @param {string} [desc]
		 */
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
			if (patternName) {
				testName(patternName);
			}

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

	it('- should not use octal escapes', () => {
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

	it('- should not cause exponential backtracking', () => {
		replaceRegExpProto(exec => {
			return function (input) {
				checkExponentialBacktracking('<Unknown>', this);
				return exec.call(this, input);
			};
		}, () => {
			forEachPattern(({ pattern, ast, tokenPath }) => {
				checkExponentialBacktracking(tokenPath, pattern, ast);
			});
		});
	});

	it('- should not cause polynomial backtracking', () => {
		replaceRegExpProto(exec => {
			return function (input) {
				checkPolynomialBacktracking('<Unknown>', this);
				return exec.call(this, input);
			};
		}, () => {
			forEachPattern(({ pattern, ast, tokenPath }) => {
				checkPolynomialBacktracking(tokenPath, pattern, ast);
			});
		});
	});

}


/**
 * Returns the first capturing group in the given pattern.
 *
 * @param {Pattern} pattern
 * @returns {CapturingGroup | undefined}
 */
function getFirstCapturingGroup(pattern) {
	let cap = undefined;

	try {
		visitRegExpAST(pattern, {
			onCapturingGroupEnter(node) {
				cap = node;
				throw new Error('stop');
			}
		});
	} catch (error) {
		// ignore errors
	}

	return cap;
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
		case 'Alternative': {
			// all elements before this element have to of zero length
			if (!parent.elements.slice(0, parent.elements.indexOf(element)).every(RAA.isZeroLength)) {
				return false;
			}
			const grandParent = parent.parent;
			if (grandParent.type === 'Pattern') {
				return true;
			} else {
				return isFirstMatch(grandParent);
			}
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

/**
 * Returns whether the given node either is or is a child of what is effectively a Kleene star.
 *
 * @param {import("regexpp/ast").Node} node
 * @returns {boolean}
 */
function underAStar(node) {
	return RAA.getEffectiveMaximumRepetition(node) > 10;
}

/**
 * @param {Iterable<T>} iter
 * @returns {T | undefined}
 * @template T
 */
function firstOf(iter) {
	const [first] = iter;
	return first;
}

/**
 * A set of all safe (non-exponentially backtracking) RegExp literals (string).
 *
 * @type {Set<string | RegExp>}
 */
const expoSafeRegexes = new Set();

/** @type {Transformers.CreationOptions} */
const options = {
	ignoreOrder: true,
	ignoreAmbiguity: true
};
const transformer = combineTransformers([
	Transformers.inline(options),
	Transformers.removeDeadBranches(options),
	Transformers.unionCharacters(options),
	Transformers.moveUpEmpty(options),
	Transformers.nestedQuantifiers(options),
	Transformers.sortAssertions(options),
	Transformers.removeUnnecessaryAssertions(options),
	Transformers.applyAssertions(options),
]);


/** @type {Map<string, Map<string, Error | null>>} */
const resultCache = new Map();
/**
 * @param {string} cacheName
 * @returns {Map<string, Error | null>}
 */
function getResultCache(cacheName) {
	let cache = resultCache.get(cacheName);
	if (cache === undefined) {
		resultCache.set(cacheName, cache = new Map());
	}
	return cache;
}
/**
 * @param {string} cacheName
 * @param {T} cacheKey
 * @param {(node: T) => void} compute
 * @returns {void}
 * @template {import('regexpp/ast').Node} T
 */
function withResultCache(cacheName, cacheKey, compute) {
	const hasBackRef = RAA.hasSomeDescendant(cacheKey, n => n.type === 'Backreference');
	if (hasBackRef) {
		compute(cacheKey);
		return;
	}

	const cache = getResultCache(cacheName);
	let cached = cache.get(cacheKey.raw);
	if (cached === undefined) {
		try {
			compute(cacheKey);
			cached = null;
		} catch (error) {
			cached = asError(error);
		}
		cache.set(cacheKey.raw, cached);
	}

	if (cached) {
		throw cached;
	}
}

/**
 * @param {unknown} error
 */
function asError(error) {
	if (error instanceof Error) {
		return error;
	} else {
		return new Error(String(error));
	}
}

/**
 * @param {string} path
 * @param {RegExp} pattern
 * @param {LiteralAST} [ast]
 * @returns {void}
 */
function checkExponentialBacktracking(path, pattern, ast) {
	if (expoSafeRegexes.has(pattern)) {
		// we know that the pattern won't cause exp backtracking because we checked before
		return;
	}
	const patternStr = String(pattern);
	if (expoSafeRegexes.has(patternStr)) {
		// we know that the pattern won't cause exp backtracking because we checked before
		return;
	}

	if (!ast) {
		ast = parseRegex(pattern);
	}

	const parser = JS.Parser.fromAst(ast);
	/**
	 * Parses the given element and creates its NFA.
	 *
	 * @param {import("refa").JS.ParsableElement} element
	 * @returns {NFA}
	 */
	function toNFA(element) {
		const { expression, maxCharacter } = parser.parseElement(element, {
			maxBackreferenceWords: 1000,
			backreferences: 'disable'
		});

		return NFA.fromRegex(transform(transformer, expression), { maxCharacter }, { assertions: 'disable' });
	}

	/**
	 * Checks whether the alternatives of the given node are disjoint. If the alternatives are not disjoint
	 * and the give node is a descendant of an effective Kleene star, then an error will be thrown.
	 *
	 * @param {CapturingGroup | Group | LookaroundAssertion} node
	 * @returns {void}
	 */
	function checkDisjointAlternatives(node) {
		if (!underAStar(node) || node.alternatives.length < 2) {
			return;
		}

		withResultCache('disjointAlternatives', node, () => {
			const alternatives = node.alternatives;

			const total = toNFA(alternatives[0]);
			total.withoutEmptyWord();
			for (let i = 1, l = alternatives.length; i < l; i++) {
				const a = alternatives[i];
				const current = toNFA(a);
				current.withoutEmptyWord();

				if (!isDisjointWith(total, current)) {
					assert.fail(`${path}: The alternative \`${a.raw}\` is not disjoint with at least one previous alternative.`
						+ ` This will cause exponential backtracking.`
						+ `\n\nTo fix this issue, you have to rewrite the ${node.type} \`${node.raw}\`.`
						+ ` The goal is that all of its alternatives are disjoint.`
						+ ` This means that if a (sub-)string is matched by the ${node.type}, then only one of its alternatives can match the (sub-)string.`
						+ `\n\nExample: \`(?:[ab]|\\w|::)+\``
						+ `\nThe alternatives of the group are not disjoint because the string "a" can be matched by both \`[ab]\` and \`\\w\`.`
						+ ` In this example, the pattern can easily be fixed because the \`[ab]\` is a subset of the \`\\w\`, so its enough to remove the \`[ab]\` alternative to get \`(?:\\w|::)+\` as the fixed pattern.`
						+ `\nIn the real world, patterns can be a lot harder to fix.`
						+ ` If you are trying to make the tests pass for a pull request but can\'t fix the issue yourself, then make the pull request (or commit) anyway.`
						+ ` A maintainer will help you.`
						+ `\n\nFull pattern:\n${pattern}`);
				} else if (i !== l - 1) {
					total.union(current);
				}
			}
		});
	}

	visitRegExpAST(ast.pattern, {
		onCapturingGroupLeave: checkDisjointAlternatives,
		onGroupLeave: checkDisjointAlternatives,
		onAssertionLeave(node) {
			if (node.kind === 'lookahead' || node.kind === 'lookbehind') {
				checkDisjointAlternatives(node);
			}
		},

		onQuantifierLeave(node) {
			if (node.max < 10) {
				return; // not a star
			}
			if (node.element.type !== 'CapturingGroup' && node.element.type !== 'Group') {
				return; // not a group
			}

			withResultCache('2star', node, () => {
				// The idea here is the following:
				//
				// We have found a part `A*` of the regex (`A` is assumed to not accept the empty word). Let `I` be
				// the intersection of `A` and `A{2,}`. If `I` is not empty, then there exists a non-empty word `w`
				// that is accepted by both `A` and `A{2,}`. That means that there exists some `m>1` for which `w`
				// is accepted by `A{m}`.
				// This means that there are at least two ways `A*` can accept `w`. It can be accepted as `A` or as
				// `A{m}`. Hence there are at least 2^n ways for `A*` to accept the word `w{n}`. This is the main
				// requirement for exponential backtracking.
				//
				// This is actually only a crude approximation for the real analysis that would have to be done. We
				// would actually have to check the intersection `A{p}` and `A{p+1,}` for all p>0. However, in most
				// cases, the approximation is good enough.

				const nfa = toNFA(node.element);
				nfa.withoutEmptyWord();
				const twoStar = nfa.copy();
				twoStar.quantify(2, Infinity);

				if (!isDisjointWith(nfa, twoStar)) {
					const exampleWordSet = firstOf(getIntersectionWordSets(nfa, twoStar));
					if (!exampleWordSet) {
						return;
					}
					const word = Words.pickMostReadableWord(exampleWordSet);
					const example = Words.fromUnicodeToString(word);
					assert.fail(`${path}: The quantifier \`${node.raw}\` ambiguous for all words ${JSON.stringify(example)}.repeat(n) for any n>1.`
						+ ` This will cause exponential backtracking.`
						+ `\n\nTo fix this issue, you have to rewrite the element (let's call it E) of the quantifier.`
						+ ` The goal is modify E such that it is disjoint with repetitions of itself.`
						+ ` This means that if a (sub-)string is matched by E, then it must not be possible for E{2}, E{3}, E{4}, etc. to match that (sub-)string.`
						+ `\n\nExample 1: \`(?:\\w+|::)+\``
						+ `\nThe problem lies in \`\\w+\` because \`\\w+\` and \`(?:\\w+){2}\` are not disjoint as the string "aa" is fully matched by both.`
						+ ` In this example, the pattern can easily be fixed by changing \`\\w+\` to \`\\w\`.`
						+ `\nExample 2: \`(?:\\w|Foo)+\``
						+ `\nThe problem lies in \`\\w\` and \`Foo\` because the string "Foo" can be matched as either repeating \`\\w\` 3 times or by using the \`Foo\` alternative once.`
						+ ` In this example, the pattern can easily be fixed because the \`Foo\` alternative is redundant can can be removed.`
						+ `\nExample 3: \`(?:\\.\\w+(?:<.*?>)?)+\``
						+ `\nThe problem lies in \`<.*?>\`. The string ".a<>.a<>" can be matched as either \`\\. \\w < . . . . >\` or \`\\. \\w < > \\. \\w < >\`.`
						+ ` When it comes to exponential backtracking, it doesn't matter whether a quantifier is greedy or lazy.`
						+ ` This means that the lazy \`.*?\` can jump over \`>\`.`
						+ ` In this example, the pattern can easily be fixed because we just have to prevent \`.*?\` jumping over \`>\`.`
						+ ` This can done by replacing \`<.*?>\` with \`<[^\\r\\n>]*>\`.`
						+ `\n\nIn the real world, patterns can be a lot harder to fix.`
						+ ` If you are trying to make this test pass for a pull request but can\'t fix the issue yourself, then make the pull request (or commit) anyway, a maintainer will help you.`
						+ `\n\nFull pattern:\n${pattern}`);
				}
			});
		},
	});

	expoSafeRegexes.add(pattern);
	expoSafeRegexes.add(patternStr);
}

/**
 * A set of all safe (non-polynomially backtracking) RegExp literals (string).
 *
 * @type {Set<string | RegExp>}
 */
const polySafeRegexes = new Set();
/**
 * @param {string} path
 * @param {RegExp} pattern
 * @param {LiteralAST} [ast]
 * @returns {void}
 */
function checkPolynomialBacktracking(path, pattern, ast) {
	if (polySafeRegexes.has(pattern)) {
		// we know that the pattern won't cause poly backtracking because we checked before
		return;
	}
	const patternStr = String(pattern);
	if (polySafeRegexes.has(patternStr)) {
		// we know that the pattern won't cause poly backtracking because we checked before
		return;
	}

	if (!ast) {
		ast = parseRegex(pattern);
	}

	const result = scslre.analyse(ast, { maxReports: 1, reportTypes: { 'Move': false } });
	if (result.reports.length > 0) {
		const report = result.reports[0];

		let rangeOffset;
		let rangeStr;
		let rangeHighlight;

		switch (report.type) {
			case 'Trade': {
				const start = Math.min(report.startQuant.start, report.endQuant.start);
				const end = Math.max(report.startQuant.end, report.endQuant.end);
				rangeOffset = start + 1;
				rangeStr = patternStr.substring(start + 1, end + 1);
				rangeHighlight = highlight([
					{ ...report.startQuant, label: 'start' },
					{ ...report.endQuant, label: 'end' }
				], -start);
				break;
			}
			case 'Self': {
				rangeOffset = report.parentQuant.start + 1;
				rangeStr = patternStr.substring(report.parentQuant.start + 1, report.parentQuant.end + 1);
				rangeHighlight = highlight([{ ...report.quant, label: 'self' }], -report.parentQuant.start);
				break;
			}
			case 'Move': {
				rangeOffset = 1;
				rangeStr = patternStr.substring(1, report.quant.end + 1);
				rangeHighlight = highlight([report.quant]);
				break;
			}
			default:
				throw new Error('Invalid report type. This should never happen.');
		}

		const attackChar = `/${report.character.literal.source}/${report.character.literal.flags}`;
		const fixed = report.fix();

		assert.fail(
			`${path}: ${report.exponential ? 'Exponential' : 'Polynomial'} backtracking. `
			+ `By repeating any character that matches ${attackChar}, an attack string can be created.`
			+ `\n`
			+ `\n${indent(rangeStr)}`
			+ `\n${indent(rangeHighlight)}`
			+ `\n`
			+ `\nFull pattern:`
			+ `\n${patternStr}`
			+ `\n${indent(rangeHighlight, ' '.repeat(rangeOffset))}`
			+ `\n`
			+ `\n` + (fixed ? `Fixed:\n/${fixed.source}/${fixed.flags}` : `Fix not available.`)
		);
	}

	polySafeRegexes.add(pattern);
	polySafeRegexes.add(patternStr);
}

/**
 * @param {Highlight[]} highlights
 * @param {number} [offset]
 * @returns {string}
 *
 * @typedef Highlight
 * @property {number} start
 * @property {number} end
 * @property {string} [label]
 */
function highlight(highlights, offset = 0) {
	highlights.sort((a, b) => a.start - b.start);

	const lines = [];
	while (highlights.length > 0) {
		const newHighlights = [];
		let l = '';
		for (const highlight of highlights) {
			const start = highlight.start + offset;
			const end = highlight.end + offset;
			if (start < l.length) {
				newHighlights.push(highlight);
			} else {
				l += ' '.repeat(start - l.length);
				l += '^';
				l += '~'.repeat(end - start - 1);
				if (highlight.label) {
					l += '[' + highlight.label + ']';
				}
			}
		}
		lines.push(l);
		highlights = newHighlights;
	}

	return lines.join('\n');
}

/**
 * @param {string} str
 * @param {string} amount
 * @returns {string}
 */
function indent(str, amount = '    ') {
	return str.split(/\r?\n/).map(m => m === '' ? '' : amount + m).join('\n');
}

/**
 * @param {(exec: RegExp["exec"]) => (this: RegExp, input: string) => RegExpExecArray | null} execSupplier
 * @param {() => void} fn
 */
function replaceRegExpProto(execSupplier, fn) {
	const oldExec = RegExp.prototype.exec;
	const oldTest = RegExp.prototype.test;
	const newExec = execSupplier(oldExec);

	RegExp.prototype.exec = newExec;
	/**
	 * @param {string} input
	 */
	RegExp.prototype.test = function (input) {
		return newExec.call(this, input) !== null;
	};

	let error;
	try {
		fn();
	} catch (e) {
		error = e;
	}

	RegExp.prototype.exec = oldExec;
	RegExp.prototype.test = oldTest;

	if (error) {
		throw error;
	}
}
