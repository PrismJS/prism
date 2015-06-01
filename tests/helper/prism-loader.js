"use strict";

var fs = require("fs");
var vm = require('vm');
var components = require("./components");
var languagesCatalog = components.languages;


module.exports = {

	/**
	 * Creates a new Prism instance with the given language loaded
	 *
	 * @param {string} language
	 * @returns {Prism}
	 */
	createInstance: function (language) {
		var Prism = this.createEmptyPrism();
		return this.loadLanguage(language, Prism);
	},


	/**
	 * Loads the given language (including recursively loading the dependencies) and
	 * appends the config to the given Prism object
	 *
	 * @private
	 * @param {string} language
	 * @param {Prism} Prism
	 * @returns {Prism}
	 */
	loadLanguage: function (language, Prism) {
		if (!languagesCatalog[language])
		{
			throw new Error("Language '" + language + "' not found.");
		}

		// if the language has a dependency -> load it first
		if (languagesCatalog[language].require)
		{
			Prism = this.loadLanguage(languagesCatalog[language].require, Prism);
		}

		// load the language itself
		var languageSource = this.loadFileSource(language);
		var context = this.runFileWithContext(languageSource, {Prism: Prism});

		return context.Prism;
	},


	/**
	 * Creates a new empty prism instance
	 *
	 * @private
	 * @returns {Prism}
	 */
	createEmptyPrism: function () {
		var coreSource = this.loadFileSource("core");
		var context = this.runFileWithContext(coreSource);
		return context.Prism;
	},


	/**
	 * Cached file sources, to prevent massive HDD work
	 *
	 * @private
	 * @type {Object.<string, string>}
	 */
	fileSourceCache: {},


	/**
	 * Loads the given file source as string
	 *
	 * @private
	 * @param {string} name
	 * @returns {string}
	 */
	loadFileSource: function (name) {
		return this.fileSourceCache[name] = this.fileSourceCache[name] || fs.readFileSync(__dirname + "/../../components/prism-" + name + ".js", "utf8");
	},


	/**
	 * Runs a VM for a given file source with the given context
	 *
	 * @private
	 * @param {string} fileSource
	 * @param {*}context
	 *
	 * @returns {*}
	 */
	runFileWithContext: function (fileSource, context) {
		context = context || {};
		vm.createContext(context);
		vm.runInContext(fileSource, context);
		return context;
	}
};
