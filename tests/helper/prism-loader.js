"use strict";

const fs = require("fs");
const vm = require("vm");
const { getAllFiles } = require("./test-discovery");
const components = require("../../components.json");
const getLoader = require("../../dependencies");
const languagesCatalog = components.languages;


/**
 * @typedef PrismLoaderContext
 * @property {any} Prism The Prism instance.
 * @property {Set<string>} loaded A set of loaded components.
 */

module.exports = {

	/**
	 * Creates a new Prism instance with the given language loaded
	 *
	 * @param {string|string[]} languages
	 * @returns {Prism}
	 */
	createInstance(languages) {
		let context = {
			loaded: new Set(),
			Prism: this.createEmptyPrism()
		};

		context = this.loadLanguages(languages, context);

		return context.Prism;
	},

	/**
	 * Loads the given languages and appends the config to the given Prism object.
	 *
	 * @private
	 * @param {string|string[]} languages
	 * @param {PrismLoaderContext} context
	 * @returns {PrismLoaderContext}
	 */
	loadLanguages(languages, context) {
		if (typeof languages === 'string') {
			languages = [languages];
		}

		getLoader(components, languages, [...context.loaded]).load(id => {
			if (!languagesCatalog[id]) {
				throw new Error(`Language '${id}' not found.`);
			}

			// load the language itself
			const languageSource = this.loadComponentSource(id);
			context.Prism = this.runFileWithContext(languageSource, { Prism: context.Prism }).Prism;

			context.loaded.add(id);
		});

		return context;
	},


	/**
	 * Creates a new empty prism instance
	 *
	 * @private
	 * @returns {Prism}
	 */
	createEmptyPrism() {
		const coreSource = this.loadComponentSource("core");
		const context = this.runFileWithContext(coreSource);

		for (const testSource of this.getChecks().map(src => this.loadFileSource(src))) {
			context.Prism = this.runFileWithContext(testSource, {
				Prism: context.Prism,
				/**
				 * A pseudo require function for the checks.
				 *
				 * This function will behave like the regular `require` in real modules when called form a check file.
				 *
				 * @param {string} id The id of relative path to require.
				 */
				require(id) {
					if (id.startsWith('./')) {
						// We have to rewrite relative paths starting with './'
						return require('./../checks/' + id.substr(2));
					} else {
						// This might be an id like 'mocha' or 'fs' or a relative path starting with '../'.
						// In both cases we don't have to change anything.
						return require(id);
					}
				}
			}).Prism;
		}

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
	 * Loads the given component's file source as string
	 *
	 * @private
	 * @param {string} name
	 * @returns {string}
	 */
	loadComponentSource(name) {
		return this.loadFileSource(__dirname + "/../../components/prism-" + name + ".js");
	},

	/**
	 * Loads the given file source as string
	 *
	 * @private
	 * @param {string} src
	 * @returns {string}
	 */
	loadFileSource(src) {
		return this.fileSourceCache[src] = this.fileSourceCache[src] || fs.readFileSync(src, "utf8");
	},


	checkCache: null,

	/**
	 * Returns a list of files which add additional checks to Prism functions.
	 *
	 * @returns {ReadonlyArray<string>}
	 */
	getChecks() {
		return this.checkCache = this.checkCache || getAllFiles(__dirname + "/../checks");
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
		// we don't have to pass our console but it's the only way these scripts can talk
		// not supplying console here means that all references to `console` inside them will refer to a no-op console
		context.console = console;
		vm.runInNewContext(fileSource, context);
		return context;
	}
};
