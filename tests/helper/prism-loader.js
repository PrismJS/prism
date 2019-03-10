"use strict";

const fs = require("fs");
const vm = require("vm");
const components = require("../../components");
const languagesCatalog = components.languages;


module.exports = {

	/**
	 * Creates a new Prism instance with the given language loaded
	 *
	 * @param {string|string[]} languages
	 * @returns {Prism}
	 */
	createInstance(languages) {
		let context = {
			loadedLanguages: [],
			Prism: this.createEmptyPrism()
		};

		context = this.loadLanguages(languages, context);

		return context.Prism;
	},

	/**
	 * Loads the given languages and appends the config to the given Prism object
	 *
	 * @private
	 * @param {string|string[]} languages
	 * @param {{loadedLanguages: string[], Prism: Prism}} context
	 * @returns {{loadedLanguages: string[], Prism: Prism}}
	 */
	loadLanguages(languages, context) {
		if (typeof languages === 'string') {
			languages = [languages];
		}

		for (const language of languages) {
			context = this.loadLanguage(language, context);
		}

		return context;
	},

	/**
	 * Loads the given language (including recursively loading the dependencies) and
	 * appends the config to the given Prism object
	 *
	 * @private
	 * @param {string} language
	 * @param {{loadedLanguages: string[], Prism: Prism}} context
	 * @returns {{loadedLanguages: string[], Prism: Prism}}
	 */
	loadLanguage(language, context) {
		if (!languagesCatalog[language]) {
			throw new Error("Language '" + language + "' not found.");
		}

		// the given language was already loaded
		if (-1 < context.loadedLanguages.indexOf(language)) {
			return context;
		}

		// if the language has a dependency -> load it first
		if (languagesCatalog[language].require) {
			context = this.loadLanguages(languagesCatalog[language].require, context);
		}

		// load the language itself
		const languageSource = this.loadFileSource(language);
		context.Prism = this.runFileWithContext(languageSource, { Prism: context.Prism }).Prism;
		context.loadedLanguages.push(language);

		return context;
	},


	/**
	 * Creates a new empty prism instance
	 *
	 * @private
	 * @returns {Prism}
	 */
	createEmptyPrism() {
		const coreSource = this.loadFileSource("core");
		const context = this.runFileWithContext(coreSource);
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
	loadFileSource(name) {
		return this.fileSourceCache[name] = this.fileSourceCache[name] || fs.readFileSync(__dirname + "/../../components/prism-" + name + ".js", "utf8");
	},


	/**
	 * Runs a VM for a given file source with the given context
	 *
	 * @private
	 * @param {string} fileSource
	 * @param {*} [context={}]
	 *
	 * @returns {*}
	 */
	runFileWithContext(fileSource, context = {}) {
		vm.runInNewContext(fileSource, context);
		return context;
	}
};
