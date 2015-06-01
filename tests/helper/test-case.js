"use strict";

var fs = require("fs");
var expect = require("chai").expect;
var PrismLoader = require("./prism-loader");

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

		expect(simplifiedTokenStream).to.eql(testCase.expectedTokenStream);
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
	 * @returns {{testSource: string, expectedTokenStream: *}|null}
	 */
	parseTestCaseFile: function (filePath) {
		var testCaseSource = fs.readFileSync(filePath, "utf8");
		var testCase = testCaseSource.split(/^----*\w*$/m);

		if (2 === testCase.length) {
			return {
				testSource: testCase[0].trim(),
				expectedTokenStream: JSON.parse(testCase[1])
			};
		}

		return null;
	}
};
