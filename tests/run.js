// @ts-check
"use strict";

const TestDiscovery = require("./helper/test-discovery");
const TestCase = require("./helper/test-case");
const path = require("path");
const { argv } = require("yargs");

const testSuite =
	(argv.language)
		? TestDiscovery.loadSomeTests(__dirname + "/languages", argv.language)
		// load complete test suite
		: TestDiscovery.loadAllTests(__dirname + "/languages");
const pretty = 'pretty' in argv;

// define tests for all tests in all languages in the test suite
for (const language in testSuite) {
	if (!testSuite.hasOwnProperty(language)) {
		continue;
	}

	(function (language, testFiles) {
		describe("Testing language '" + language + "'", function () {
			this.timeout(10000);

			for (const filePath of testFiles) {
				const fileName = path.basename(filePath, path.extname(filePath));

				it("– should pass test case '" + fileName + "'", function () {
					if (path.extname(filePath) === '.test') {
						TestCase.runTestCase(language, filePath, pretty);
					} else {
						TestCase.runTestsWithHooks(language, require(filePath));
					}
				});
			}
		});
	})(language, testSuite[language]);
}
