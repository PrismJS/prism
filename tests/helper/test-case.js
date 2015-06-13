"use strict";

var fs = require("fs");
var assert = require("chai").assert;
var PrismLoader = require("./prism-loader");

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
	 * @param {string} language
	 * @param {string} filePath
	 */
	runTestCase: function (language, filePath) {
		var testCase = this.parseTestCaseFile(filePath);

		if (null === testCase) {
			throw new Error("Test case file has invalid format, please read the docs.");
		}

		var Prism = PrismLoader.createInstance(language);
		var compiledTokenStream = Prism.tokenize(testCase.testSource, Prism.languages[language]);
		var simplifiedTokenStream = this.transformCompiledTokenStream(compiledTokenStream);

		assert.deepEqual(simplifiedTokenStream, testCase.expectedTokenStream, testCase.comment);
	},


	/**
	 * Simplifies the token stream to ease the matching with the expected token stream
	 *
	 * @param {string} tokenStream
	 * @returns {Array.<string[]>}
	 */
	transformCompiledTokenStream: function (tokenStream) {
		return tokenStream.filter(
			function (token) {
				// only support objects
				return (typeof token === "object");
			}
		).map(
			function (entry)
			{
				return [entry.type, entry.content];
			}
		);
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

		// No expected token stream found
		if (2 > testCaseParts.length) {
			return null;
		}

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
};
