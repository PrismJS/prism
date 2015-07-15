"use strict";

var fs = require("fs");
var assert = require("chai").assert;
var PrismLoader = require("./prism-loader");
var TokenStreamTransformer = require("./token-stream-transformer");

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
 * @type {{runTestCase: Function, transformCompiledTokenStream: Function, parseTestCaseFile: Function}}
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
	 */
	runTestCase: function (languageIdentifier, filePath) {
		var testCase = this.parseTestCaseFile(filePath);
		var languages = languageIdentifier.split("+");

		if (null === testCase) {
			throw new Error("Test case file has invalid format (or the provided token stream is invalid JSON), please read the docs.");
		}

		var Prism = PrismLoader.createInstance(languages);
		// the first language is the main language to highlight
		var mainLanguageGrammar = Prism.languages[languages[0]];
		var compiledTokenStream = Prism.tokenize(testCase.testSource, mainLanguageGrammar);
		var simplifiedTokenStream = TokenStreamTransformer.simplify(compiledTokenStream);

		assert.deepEqual(simplifiedTokenStream, testCase.expectedTokenStream, testCase.comment);
	},



	/**
	 * Parses the test case from the given test case file
	 *
	 * @private
	 * @param {string} filePath
	 * @returns {{testSource: string, expectedTokenStream: Array.<Array.<string>>, comment:string?}|null}
	 */
	parseTestCaseFile: function (filePath) {
		var testCaseSource = fs.readFileSync(filePath, "utf8");
		var testCaseParts = testCaseSource.split(/^----*\w*$/m);

		try {
			var testCase = {
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
		catch (e)
		{
			// the JSON can't be parsed (e.g. it could be empty)
			return null;
		}
	}
};
