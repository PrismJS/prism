"use strict";

const TestDiscovery = require("./helper/test-discovery");
const TestCase = require("./helper/test-case");
const path = require("path");
const PrismLoader = require("./helper/prism-loader");
const { BFS, BFSPathToPrismTokenPath } = require("./helper/util");
const { assert } = require("chai");
const components = require("../components.json");
const ALL_LANGUAGES = [...Object.keys(components.languages).filter(k => k !== 'meta')];


describe('Pattern test coverage', function () {
	const testSuite = TestDiscovery.loadAllTests(__dirname + "/languages");

	/**
	 * @type {Map<string, PatternData>}
	 * @typedef PatternData
	 * @property {string} pattern
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
						pattern: String(regex),
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

	// This will cause ALL regexes of Prism to be registered in the patterns map.
	// (Languages that don't have any tests can't be caught otherwise.)
	createInstance(ALL_LANGUAGES);

	describe('Run all language tests', function () {
		// define tests for all tests in all languages in the test suite
		for (const languageIdentifier in testSuite) {
			if (!testSuite.hasOwnProperty(languageIdentifier)) {
				continue;
			}

			it(languageIdentifier, function () {
				this.timeout(10000);

				for (const filePath of testSuite[languageIdentifier]) {
					if (path.extname(filePath) === '.test') {
						TestCase.runTestCase({ languageIdentifier, filePath, createInstance });
					} else {
						TestCase.runTestsWithHooks({ languageIdentifier, codes: require(filePath), createInstance });
					}
				}
			});
		}
	});

	describe('Coverage', function () {
		for (const language of ALL_LANGUAGES) {
			it(`- should cover all patterns in ${language}`, function () {
				const untested = [...patterns.values()].filter(d => d.language === language && d.matches.length === 0);
				if (untested.length > 0) {
					assert.fail([
						`${untested.length} pattern(s) in ${language} are untested:\n`
						+ 'You can learn more about writing tests at https://prismjs.com/test-suite.html#writing-tests',
						...untested.map(data => {
							const occurrences = [...data.from];
							return [
								`${occurrences[0]}:`,
								`\t${data.pattern.length > 80 ? data.pattern.slice(0, 80) + '…' : data.pattern}`,
								'This pattern is completely untested. Add test files that match this pattern.',
								...(occurrences.length > 1 ? ['Other occurrences of this pattern:', ...occurrences.slice(1)] : [])
							].join('\n');
						})
					].join('\n\n'));
				}
			});
		}
	});
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
