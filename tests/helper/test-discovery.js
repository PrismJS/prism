'use strict';

const fs = require('fs');
const path = require('path');

const SUPPORTED_TEST_FILE_EXT = new Set(['.js', '.test']);

module.exports = {

	/**
	 * Loads the list of all available tests
	 *
	 * @param {string} rootDir
	 * @returns {Object<string, string[]>}
	 */
	loadAllTests(rootDir) {
		/** @type {Object.<string, string[]>} */
		const testSuite = {};

		for (const language of this.getAllDirectories(rootDir)) {
			testSuite[language] = this.getAllFiles(path.join(rootDir, language));
		}

		return testSuite;
	},

	/**
	 * Loads the list of available tests that match the given languages
	 *
	 * @param {string} rootDir
	 * @param {string|string[]} languages
	 * @returns {Object<string, string[]>}
	 */
	loadSomeTests(rootDir, languages) {
		/** @type {Object.<string, string[]>} */
		const testSuite = {};

		for (const language of this.getSomeDirectories(rootDir, languages)) {
			testSuite[language] = this.getAllFiles(path.join(rootDir, language));
		}

		return testSuite;
	},


	/**
	 * Returns a list of all (sub)directories (just the directory names, not full paths)
	 * in the given src directory
	 *
	 * @param {string} src
	 * @returns {string[]}
	 */
	getAllDirectories(src) {
		return fs.readdirSync(src).filter(file => {
			return fs.statSync(path.join(src, file)).isDirectory();
		});
	},

	/**
	 * Returns a list of all (sub)directories (just the directory names, not full paths)
	 * in the given src directory, matching the given languages
	 *
	 * @param {string} src
	 * @param {string|string[]} languages
	 * @returns {string[]}
	 */
	getSomeDirectories(src, languages) {
		return fs.readdirSync(src).filter(file => {
			return fs.statSync(path.join(src, file)).isDirectory() && this.directoryMatches(file, languages);
		});
	},

	/**
	 * Returns whether a directory matches one of the given languages.
	 *
	 * @param {string} directory
	 * @param {string|string[]} languages
	 */
	directoryMatches(directory, languages) {
		if (!Array.isArray(languages)) {
			languages = [languages];
		}
		const dirLanguages = directory.split(/!?\+!?/);
		return dirLanguages.some(lang => languages.indexOf(lang) >= 0);
	},


	/**
	 * Returns a list of all full file paths to all files in the given src directory
	 *
	 * @private
	 * @param {string} src
	 * @returns {string[]}
	 */
	getAllFiles(src) {
		return fs.readdirSync(src)
			.filter(fileName => {
				return SUPPORTED_TEST_FILE_EXT.has(path.extname(fileName))
					&& fs.statSync(path.join(src, fileName)).isFile();
			})
			.map(fileName => {
				return path.join(src, fileName);
			});
	}
};
