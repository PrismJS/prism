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

const acceptEmpty = !!argv.accept;

// define tests for all tests in all languages in the test suite
for (const languageIdentifier in testSuite) {
	if (!testSuite.hasOwnProperty(languageIdentifier)) {
		continue;
	}

	(function (languageIdentifier, testFiles) {
		describe("Testing language '" + languageIdentifier + "'", function () {
			this.timeout(10000);

			for (const filePath of testFiles) {
				const fileName = path.basename(filePath, path.extname(filePath));

				it("– should pass test case '" + fileName + "'", function () {
					if (path.extname(filePath) === '.test') {
						TestCase.runTestCase({ languageIdentifier, filePath, acceptEmpty });
					} else {
						TestCase.runTestsWithHooks({ languageIdentifier, codes: require(filePath) });
					}
				});
			}
		});
	})(languageIdentifier, testSuite[languageIdentifier]);
}
