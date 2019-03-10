"use strict";

const fs = require("fs");
const { assert } = require("chai");
const PrismLoader = require("./prism-loader");
const TokenStreamTransformer = require("./token-stream-transformer");

/**
 * Handles parsing of a test case file.
 *
 *
 * A test case file consists of at least two parts, separated by a line of dashes.
 * This separation line must start at the beginning of the line and consist of at least three dashes.
 *
 * The test case file can either consist of two parts:
 *
 *     {source code}
 *     ----
 *     {expected token stream}
 *
 *
 * or of three parts:
 *
 *     {source code}
 *     ----
 *     {expected token stream}
 *     ----
 *     {text comment explaining the test case}
 *
 * If the file contains more than three parts, the remaining parts are just ignored.
 * If the file however does not contain at least two parts (so no expected token stream),
 * the test case will later be marked as failed.
 *
 *
 */
module.exports = {

	/**
	 * Runs the given test case file and asserts the result
	 *
	 * The passed language identifier can either be a language like "css" or a composed language
	 * identifier like "css+markup". Composed identifiers can be used for testing language inclusion.
	 *
	 * When testing language inclusion, the first given language is the main language which will be passed
	 * to Prism for highlighting ("css+markup" will result in a call to Prism to highlight with the "css" grammar).
	 * But it will be ensured, that the additional passed languages will be loaded too.
	 *
	 * The languages will be loaded in the order they were provided.
	 *
	 * @param {string} languageIdentifier
	 * @param {string} filePath
	 * @param {boolean} [pretty=false]
	 */
	runTestCase(languageIdentifier, filePath, pretty = false) {
		const testCase = this.parseTestCaseFile(filePath);
		const usedLanguages = this.parseLanguageNames(languageIdentifier);

		if (null === testCase) {
			throw new Error("Test case file has invalid format (or the provided token stream is invalid JSON), please read the docs.");
		}

		const Prism = PrismLoader.createInstance(usedLanguages.languages);
		// the first language is the main language to highlight
		const mainLanguageGrammar = Prism.languages[usedLanguages.mainLanguage];
		const env = {
			code: testCase.testSource,
			grammar: mainLanguageGrammar,
			language: usedLanguages.mainLanguage
		};
		Prism.hooks.run('before-tokenize', env);
		env.tokens = Prism.tokenize(env.code, env.grammar);
		Prism.hooks.run('after-tokenize', env);
		const compiledTokenStream = env.tokens;

		const simplifiedTokenStream = TokenStreamTransformer.simplify(compiledTokenStream);

		const tzd = JSON.stringify(simplifiedTokenStream);
		const exp = JSON.stringify(testCase.expectedTokenStream);
		let i = 0;
		let j = 0;
		let diff = "";
		while (j < tzd.length) {
			if (exp[i] != tzd[j] || i == exp.length)
				diff += tzd[j];
			else
				i++;
			j++;
		}

		const tokenStreamStr = pretty ? TokenStreamTransformer.prettyprint(simplifiedTokenStream) : tzd;
		const message = "\nToken Stream: \n" + tokenStreamStr +
			"\n-----------------------------------------\n" +
			"Expected Token Stream: \n" + exp +
			"\n-----------------------------------------\n" + diff;

		const result = assert.deepEqual(simplifiedTokenStream, testCase.expectedTokenStream, testCase.comment + message);
	},


	/**
	 * Parses the language names and finds the main language.
	 *
	 * It is either the last language or the language followed by a exclamation mark “!”.
	 * There should only be one language with an exclamation mark.
	 *
	 * @param {string} languageIdentifier
	 *
	 * @returns {{languages: string[], mainLanguage: string}}
	 */
	parseLanguageNames(languageIdentifier) {
		let languages = languageIdentifier.split("+");
		let mainLanguage = null;

		languages = languages.map(
			function (language) {
				const pos = language.indexOf("!");

				if (-1 < pos) {
					if (mainLanguage) {
						throw "There are multiple main languages defined.";
					}

					mainLanguage = language.replace("!", "");
					return mainLanguage;
				}

				return language;
			}
		);

		if (!mainLanguage) {
			mainLanguage = languages[languages.length - 1];
		}

		return {
			languages: languages,
			mainLanguage: mainLanguage
		};
	},


	/**
	 * Parses the test case from the given test case file
	 *
	 * @private
	 * @param {string} filePath
	 * @returns {{testSource: string, expectedTokenStream: Array.<Array.<string>>, comment:string?}|null}
	 */
	parseTestCaseFile(filePath) {
		const testCaseSource = fs.readFileSync(filePath, "utf8");
		const testCaseParts = testCaseSource.split(/^-{10,}\w*$/m);

		try {
			const testCase = {
				testSource: testCaseParts[0].trim(),
				expectedTokenStream: JSON.parse(testCaseParts[1]),
				comment: null
			};

			// if there are three parts, the third one is the comment
			// explaining the test case
			if (testCaseParts[2]) {
				testCase.comment = testCaseParts[2].trim();
			}

			return testCase;
		}
		catch (e) {
			// the JSON can't be parsed (e.g. it could be empty)
			return null;
		}
	},

	/**
	 * Runs the given pieces of codes and asserts their result.
	 *
	 * Code is provided as the key and expected result as the value.
	 *
	 * @param {string} languageIdentifier
	 * @param {object} codes
	 */
	runTestsWithHooks(languageIdentifier, codes) {
		const usedLanguages = this.parseLanguageNames(languageIdentifier);
		const Prism = PrismLoader.createInstance(usedLanguages.languages);
		// the first language is the main language to highlight

		for (const code in codes) {
			if (codes.hasOwnProperty(code)) {
				const env = {
					element: {},
					language: usedLanguages.mainLanguage,
					grammar: Prism.languages[usedLanguages.mainLanguage],
					code: code
				};
				Prism.hooks.run('before-highlight', env);
				env.highlightedCode = Prism.highlight(env.code, env.grammar, env.language);
				Prism.hooks.run('before-insert', env);
				env.element.innerHTML = env.highlightedCode;
				Prism.hooks.run('after-highlight', env);
				Prism.hooks.run('complete', env);
				assert.equal(env.highlightedCode, codes[code]);
			}
		}
	}
};
