"use strict";

var fs = require("fs");
var path = require("path");


module.exports = {

	/**
	 * Loads the list of all available tests
	 *
	 * @param {string} rootDir
	 * @returns {Object.<string, string[]>}
	 */
	loadAllTests: function (rootDir) {
		var testSuite = {};
		var self = this;

		this.getAllDirectories(rootDir).forEach(
			function (language) {
				testSuite[language] = self.getAllFiles(path.join(rootDir, language));
			}
		);

		return testSuite;
	},


	/**
	 * Returns a list of all (sub)directories (just the directory names, not full paths)
	 * in the given src directory
	 *
	 * @param {string} src
	 * @returns {Array.<string>}
	 */
	getAllDirectories: function (src) {
		return fs.readdirSync(src).filter(
			function (file) {
				return fs.statSync(path.join(src, file)).isDirectory();
			}
		);
	},


	/**
	 * Returns a list of all full file paths to all files in the given src directory
	 *
	 * @private
	 * @param {string} src
	 * @returns {Array.<string>}
	 */
	getAllFiles: function (src) {
		return fs.readdirSync(src).filter(
			function (fileName) {
				// only find files that have the ".test" extension
				return ".test" === path.extname(fileName) &&
					fs.statSync(path.join(src, fileName)).isFile();
			}
		).map(
			function (fileName) {
				return path.join(src, fileName);
			}
		);
	}
};
