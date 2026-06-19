import { assert } from 'chai';
import { toArray } from '../src/util/iterables.js';
import * as PrismLoader from './helper/prism-loader.js';
import { runTestCase } from './helper/test-case.js';
import { loadAllTests } from './helper/test-discovery.js';
import { BFS, BFSPathToPrismTokenPath, isRegExp } from './helper/util.js';

describe('Pattern test coverage', () => {
	/** @type {Map<string, PatternData>} */
	const patterns = new Map();

	/**
	 * Creates a key for pattern lookup based on source and normalized flags.
	 * Normalizes flags by removing `g` and `d` (which Prism may add) and sorting the rest.
	 * Uses a simple loop instead of `String.replace` to avoid triggering our `RegExp.exec` interception.
	 *
	 * @param {string} source
	 * @param {string} flags
	 * @returns {string}
	 */
	function getSourceKey (source, flags) {
		// Normalize flags: remove 'g' and 'd', then sort
		let normalizedFlags = '';
		for (let i = 0; i < flags.length; i++) {
			const flag = flags[i];
			if (flag !== 'g' && flag !== 'd') {
				normalizedFlags += flag;
			}
		}
		normalizedFlags = normalizedFlags.split('').sort().join('');
		return `${source}|${normalizedFlags}`;
	}

	/**
	 * @param {string | string[]} languages
	 * @returns {Promise<Prism>}
	 */
	async function createInstance (languages) {
		const Prism = await PrismLoader.createInstance(languages);

		const root = Object.fromEntries(
			toArray(languages).map(id => [
				id,
				Prism.languageRegistry.getLanguage(id)?.resolvedGrammar,
			])
		);

		BFS(root, (path, object) => {
			const { key, value } = path[path.length - 1];
			const tokenPath = BFSPathToPrismTokenPath(path);

			if (key && isRegExp(value)) {
				const regex = makeGlobal(value);
				object[key] = regex;

				// Register with the original regex's source and flags (before making global)
				// This matches what Prism will use when creating new RegExp objects
				const patternKey = getSourceKey(value.source, value.flags);
				let data = patterns.get(patternKey);
				if (!data) {
					data = {
						pattern: regex,
						language: path[1].key ?? '',
						from: new Set(),
						matches: [],
					};
					patterns.set(patternKey, data);
				}
				data.from.add(tokenPath);
			}
		});

		return Prism;
	}

	// Intercept RegExp.prototype.exec globally to track all pattern matches.
	// We use global interception (instead of per-regex interception) because Prism creates new RegExp
	// objects when adding flags (see src/core/tokenize/match.js). Per-regex interception
	// would only catch the original regex objects, missing matches on the new ones.
	// This is safe because we only track patterns that exist in our map.
	const originalExec = RegExp.prototype.exec;
	RegExp.prototype.exec = function (string) {
		const match = originalExec.call(this, string);
		if (match) {
			const patternKey = getSourceKey(this.source, this.flags);
			const data = patterns.get(patternKey);
			if (data) {
				data.matches.push(match);
			}
		}
		return match;
	};

	describe('Register all patterns', () => {
		it('all', async function () {
			this.slow(10 * 1000);
			// This will cause ALL regexes of Prism to be registered in the patterns map.
			// (Languages that don't have any tests can't be caught otherwise.)
			await createInstance(PrismLoader.getLanguageIds());
		});
	});

	describe('Run all language tests', () => {
		// define tests for all tests in all languages in the test suite
		for (const [languageIdentifier, files] of loadAllTests()) {
			it(languageIdentifier, async function () {
				this.timeout(10 * 1000);

				for (const filePath of files) {
					try {
						await runTestCase(languageIdentifier, filePath, 'none', createInstance);
					}
					catch {
						// we don't case about whether the test succeeds,
						// we just want to gather usage data
					}
				}
			});
		}
	});

	describe('Coverage', () => {
		for (const language of PrismLoader.getLanguageIds()) {
			describe(language, () => {
				it(`- should cover all patterns`, () => {
					const untested = getAllOf(language).filter(d => d.matches.length === 0);
					if (untested.length === 0) {
						return;
					}

					const problems = untested.map(data => {
						return formatProblem(data, [
							'This pattern is completely untested. Add test files that match this pattern.',
						]);
					});

					assert.fail(
						[
							`${problems.length} pattern(s) are untested:\n` +
								'You can learn more about writing tests at https://prismjs.com/test-suite.html#writing-tests',
							...problems,
						].join('\n\n')
					);
				});

				it(`- should exhaustively cover all keywords in keyword lists`, () => {
					const problems = [];

					for (const data of getAllOf(language)) {
						if (data.matches.length === 0) {
							// don't report the same pattern twice
							continue;
						}

						const keywords = getKeywordList(data.pattern);
						if (!keywords) {
							continue;
						}
						const keywordCount = keywords.size;

						data.matches.forEach(([m]) => {
							if (data.pattern.ignoreCase) {
								m = m.toUpperCase();
							}
							keywords.delete(m);
						});

						if (keywords.size > 0) {
							problems.push(
								formatProblem(data, [
									`Add test files to test all keywords. The following keywords (${keywords.size}/${keywordCount}) are untested:`,
									...[...keywords].map(k => `    ${k}`),
								])
							);
						}
					}

					if (problems.length === 0) {
						return;
					}

					assert.fail(
						[
							`${problems.length} keyword list(s) are not exhaustively tested:\n` +
								'You can learn more about writing tests at https://prismjs.com/test-suite.html#writing-tests',
							...problems,
						].join('\n\n')
					);
				});
			});
		}
	});

	/**
	 * @param {string} language
	 * @returns {PatternData[]}
	 */
	function getAllOf (language) {
		return [...patterns.values()].filter(d => d.language === language);
	}

	/**
	 * @param {string} string
	 * @param {number} maxLength
	 * @returns {string}
	 */
	function short (string, maxLength) {
		if (string.length > maxLength) {
			return string.slice(0, maxLength - 1) + '…';
		}
		else {
			return string;
		}
	}

	/**
	 * If the given pattern string describes a keyword list, all keyword will be returned. Otherwise, `null` will be
	 * returned.
	 *
	 * @param {RegExp} pattern
	 * @returns {Set<string> | null}
	 */
	function getKeywordList (pattern) {
		// Right now, only keyword lists of the form /\b(?:foo|bar)\b/ are supported.
		// In the future, we might want to convert these regexes to NFAs and iterate all words to cover more complex
		// keyword lists and even operator and punctuation lists.

		let source = pattern.source.replace(/^\\b|\\b$/g, '');
		if (source.startsWith('(?:') && source.endsWith(')')) {
			source = source.slice('(?:'.length, source.length - ')'.length);
		}

		if (/^\w+(?:\|\w+)*$/.test(source)) {
			if (pattern.ignoreCase) {
				source = source.toUpperCase();
			}
			return new Set(source.split(/\|/));
		}
		else {
			return null;
		}
	}

	/**
	 * @param {Iterable<string>} occurrences
	 * @returns {{ origin: string; otherOccurrences: string[] }}
	 */
	function splitOccurrences (occurrences) {
		const all = [...occurrences];
		return {
			origin: all[0],
			otherOccurrences: all.slice(1),
		};
	}

	/**
	 * @param {PatternData} data
	 * @param {string[]} messageLines
	 * @returns {string}
	 */
	function formatProblem (data, messageLines) {
		const { origin, otherOccurrences } = splitOccurrences(data.from);

		const lines = [`${origin}:`, short(String(data.pattern), 100), '', ...messageLines];

		if (otherOccurrences.length) {
			lines.push(
				'',
				'Other occurrences of this pattern:',
				...otherOccurrences.map(o => `- ${o}`)
			);
		}

		return lines.join('\n    ');
	}
});

/**
 * @param {RegExp} regex
 * @returns {RegExp}
 */
function makeGlobal (regex) {
	if (regex.global) {
		return regex;
	}
	else {
		return RegExp(regex.source, regex.flags + 'g');
	}
}

/**
 * @typedef {object} PatternData
 * @property {RegExp} pattern
 * @property {string} language
 * @property {Set<string>} from
 * @property {RegExpExecArray[]} matches
 */
