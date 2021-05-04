'use strict';

const TestDiscovery = require('./helper/test-discovery');
const TestCase = require('./helper/test-case');
const PrismLoader = require('./helper/prism-loader');
const { BFS, BFSPathToPrismTokenPath } = require('./helper/util');
const { assert } = require('chai');
const components = require('../components.json');
const ALL_LANGUAGES = [...Object.keys(components.languages).filter(k => k !== 'meta')];


describe('Pattern test coverage', function () {
	/**
	 * @type {Map<string, PatternData>}
	 * @typedef PatternData
	 * @property {RegExp} pattern
	 * @property {string} language
	 * @property {Set<string>} from
	 * @property {RegExpExecArray[]} matches
	 */
	const patterns = new Map();

	/**
	 * @param {string | string[]} languages
	 * @returns {import("./helper/prism-loader").PrismInstance}
	 */
	function createInstance(languages) {
		const Prism = PrismLoader.createInstance(languages);

		BFS(Prism.languages, (path, object) => {
			const { key, value } = path[path.length - 1];
			const tokenPath = BFSPathToPrismTokenPath(path);

			if (Object.prototype.toString.call(value) == '[object RegExp]') {
				const regex = makeGlobal(value);
				object[key] = regex;

				const patternKey = String(regex);
				let data = patterns.get(patternKey);
				if (!data) {
					data = {
						pattern: regex,
						language: path[1].key,
						from: new Set([tokenPath]),
						matches: []
					};
					patterns.set(patternKey, data);
				} else {
					data.from.add(tokenPath);
				}

				regex.exec = string => {
					let match = RegExp.prototype.exec.call(regex, string);
					if (match) {
						data.matches.push(match);
					}
					return match;
				};
			}
		});

		return Prism;
	}

	describe('Register all patterns', function () {
		it('all', function () {
			this.slow(10 * 1000);
			// This will cause ALL regexes of Prism to be registered in the patterns map.
			// (Languages that don't have any tests can't be caught otherwise.)
			createInstance(ALL_LANGUAGES);
		});
	});

	describe('Run all language tests', function () {
		// define tests for all tests in all languages in the test suite
		for (const [languageIdentifier, files] of TestDiscovery.loadAllTests()) {
			it(languageIdentifier, function () {
				this.timeout(10 * 1000);

				for (const filePath of files) {
					TestCase.run({ languageIdentifier, filePath, createInstance });
				}
			});
		}
	});

	describe('Coverage', function () {
		for (const language of ALL_LANGUAGES) {
			describe(language, function () {
				it(`- should cover all patterns`, function () {
					const untested = getAllOf(language).filter(d => d.matches.length === 0);
					if (untested.length === 0) {
						return;
					}

					const problems = untested.map(data => {
						const { origin, otherOccurrences } = splitOccurrences(data.from);
						return [
							`${origin}:\n\t${short(String(data.pattern), 80)}`,
							'This pattern is completely untested. Add test files that match this pattern.',
							...(otherOccurrences.length ? ['Other occurrences of this pattern:', ...otherOccurrences] : [])
						].join('\n');
					});

					assert.fail([
						`${problems.length} pattern(s) are untested:\n`
						+ 'You can learn more about writing tests at https://prismjs.com/test-suite.html#writing-tests',
						...problems
					].join('\n\n'));
				});

				it(`- should exhaustively cover all keywords in keyword lists`, function () {
					const problems = [];

					for (const { pattern, matches, from } of getAllOf(language)) {
						if (matches.length === 0) {
							// don't report the same pattern twice
							continue;
						}

						const keywords = getKeywordList(pattern);
						if (!keywords) {
							continue;
						}
						const keywordCount = keywords.size;

						matches.forEach(([m]) => {
							if (pattern.ignoreCase) {
								m = m.toUpperCase();
							}
							keywords.delete(m);
						});

						if (keywords.size > 0) {
							const { origin, otherOccurrences } = splitOccurrences(from);
							problems.push([
								`${origin}:\n\t${short(String(pattern), 80)}`,
								`Add test files to test all keywords. The following ${keywords.size}/${keywordCount} keywords are untested:`,
								`${[...keywords].map(k => `\t${k}`).join('\n')}`,
								...(otherOccurrences.length ? ['Other occurrences of this pattern:', ...otherOccurrences] : [])
							].join('\n'));
						}
					}

					if (problems.length === 0) {
						return;
					}

					assert.fail([
						`${problems.length} keyword list(s) are not exhaustively tested:\n`
						+ 'You can learn more about writing tests at https://prismjs.com/test-suite.html#writing-tests',
						...problems
					].join('\n\n'));
				});
			});
		}
	});

	/**
	 * @param {string} language
	 * @returns {PatternData[]}
	 */
	function getAllOf(language) {
		return [...patterns.values()].filter(d => d.language === language);
	}

	/**
	 * @param {string} string
	 * @param {number} maxLength
	 * @returns {string}
	 */
	function short(string, maxLength) {
		if (string.length > maxLength) {
			return string.slice(0, maxLength - 1) + '…';
		} else {
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
	function getKeywordList(pattern) {
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
			return new Set(source.split(/\|/g));
		} else {
			return null;
		}
	}

	/**
	 * @param {Iterable<string>} occurrences
	 * @returns {{ origin: string; otherOccurrences: string[] }}
	 */
	function splitOccurrences(occurrences) {
		const all = [...occurrences];
		return {
			origin: all[0],
			otherOccurrences: all.slice(1),
		};
	}
});

/**
 * @param {RegExp} regex
 * @returns {RegExp}
 */
function makeGlobal(regex) {
	if (regex.global) {
		return regex;
	} else {
		return RegExp(regex.source, regex.flags + 'g');
	}
}
