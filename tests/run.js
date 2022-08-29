import path from 'path';
import { language, update } from './helper/args';
import * as TestCase from './helper/test-case';
import * as TestDiscovery from './helper/test-discovery';

const testSuite =
	language
		? TestDiscovery.loadSomeTests(language)
		// load complete test suite
		: TestDiscovery.loadAllTests();


// define tests for all tests in all languages in the test suite
for (const [languageIdentifier, files] of testSuite) {
	describe("Testing language '" + languageIdentifier + "'", function () {
		this.timeout(10000);

		for (const filePath of files) {
			const fileName = path.basename(filePath, path.extname(filePath));

			it("– should pass test case '" + fileName + "'", async () => {
				await TestCase.runTestCase(languageIdentifier, filePath, update ? 'update' : 'insert');
			});
		}
	});
}
