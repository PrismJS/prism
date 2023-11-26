'use strict';

import * as path from "node:path"
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import * as TestDiscovery from './helper/test-discovery.js'
import * as TestCase from './helper/test-case.js'

const { argv } = yargs(hideBin(process.argv))

const testSuite =
	(argv.language)
		? TestDiscovery.loadSomeTests(argv.language)
		// load complete test suite
		: TestDiscovery.loadAllTests();

const update = !!argv.update;

// define tests for all tests in all languages in the test suite
for (const [languageIdentifier, files] of testSuite) {
	describe("Testing language '" + languageIdentifier + "'", function () {
		this.timeout(10000);

		for (const filePath of files) {
			const fileName = path.basename(filePath, path.extname(filePath));

			it("– should pass test case '" + fileName + "'", function () {
				TestCase.runTestCase(languageIdentifier, filePath, update ? 'update' : 'insert');
			});
		}
	});
}