"use strict";

var TestDiscovery = require("./helper/test-discovery");
var TestCase = require("./helper/test-case");
var path = require("path");

// load complete test suite
var testSuite = TestDiscovery.loadAllTests(__dirname + "/languages");

// define tests for all tests in all languages in the test suite
for (var language in testSuite) {
	if (!testSuite.hasOwnProperty(language)) {
		continue;
	}

	(function (language, testFiles) {
		describe("Testing language '" + language + "'", function () {
			testFiles.forEach(
				function (filePath) {
					var fileName = path.basename(filePath, path.extname(filePath));

					it("– should pass test case '" + fileName + "'",
						function () {
							TestCase.runTestCase(language, filePath);
						}
					);
				}
			);
		});
	})(language, testSuite[language]);
}
