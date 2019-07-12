"use strict";

const fs = require("fs");
const vm = require("vm");
const { JSDOM } = require('jsdom');
const { getAllFiles } = require("./test-discovery");
const { languages: languagesCatalog, plugins: pluginsCatalog } = require("../../components");


/**
 * Wraps the given value in an array if it's not an array already.
 *
 * @param {T[] | T} value
 * @returns {T[]}
 * @template T
 */
function toArray(value) {
	return Array.isArray(value) ? value : [value];
}


/**
 * @typedef PrismContext
 * @property {string[]} loadedLanguages
 * @property {Prism} Prism
 *
 * @typedef {import("jsdom").DOMWindow & { Prism: any }} PrismWindow
 *
 * @typedef PrismDOM
 * @property {PrismWindow} window
 * @property {(languages: string | string[]) => void} loadLanguages
 * @property {(plugins: string | string[]) => void} loadPlugins
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
			loadedLanguages: [],
			Prism: this.createEmptyPrism()
		};

		context = this.loadLanguages(languages, context);

		return context.Prism;
	},

	/**
	 * Creates a new JavaScript DOM instance with Prism being loaded.
	 *
	 * @returns {PrismDOM}
	 */
	createPrismDOM() {
		const dom = new JSDOM(``, {
			runScripts: 'outside-only'
		});
		const window = dom.window;

		const loadLanguageSource = this.loadComponentSource.bind(this);
		const loadPluginSource = this.loadPluginSource.bind(this);

		window.self = window; // set self for plugins
		window.eval(loadLanguageSource('core'));

		const loadedLanguages = new Set();
		const loadedPlugins = new Set();

		return {
			window: /** @type {PrismWindow} */ (window),

			loadLanguages: function loadLanguages(languages) {
				for (const language of toArray(languages)) {
					if (!(language in languagesCatalog)) {
						throw new Error(`Unknown language '${language}'`);
					}

					if (loadedLanguages.has(language)) {
						continue;
					}
					loadedLanguages.add(language);

					const require = languagesCatalog[language].require;
					if (require) {
						loadLanguages(require);
					}

					window.eval(loadLanguageSource(language));
				}
			},

			loadPlugins: function loadPlugins(plugins) {
				for (const plugin of toArray(plugins)) {
					if (!(plugin in pluginsCatalog)) {
						throw new Error(`Unknown plugin '${plugin}'`);
					}

					if (loadedPlugins.has(plugin)) {
						continue;
					}
					loadedPlugins.add(plugin);

					const require = pluginsCatalog[plugin].require;
					if (require) {
						loadPlugins(require);
					}

					window.eval(loadPluginSource(plugin));
				}
			},
		};
	},

	/**
	 * Loads the given languages and appends the config to the given Prism object
	 *
	 * @private
	 * @param {string|string[]} languages
	 * @param {PrismContext} context
	 * @returns {PrismContext}
	 */
	loadLanguages(languages, context) {
		for (const language of toArray(languages)) {
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
	 * @param {PrismContext} context
	 * @returns {PrismContext}
	 */
	loadLanguage(language, context) {
		if (!languagesCatalog[language]) {
			throw new Error(`Language '${language}' not found.`);
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
		const languageSource = this.loadComponentSource(language);
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
		const coreSource = this.loadComponentSource('core');
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
		return this.loadFileSource(`${__dirname}/../../components/prism-${name}.js`);
	},

	/**
	 * Loads the given plugin's file source as string
	 *
	 * @private
	 * @param {string} name
	 * @returns {string}
	 */
	loadPluginSource(name) {
		return this.loadFileSource(`${__dirname}/../../plugins/${name}/prism-${name}.js`);
	},

	/**
	 * Loads the given file source as string
	 *
	 * @private
	 * @param {string} src
	 * @returns {string}
	 */
	loadFileSource(src) {
		return this.fileSourceCache[src] = this.fileSourceCache[src] || fs.readFileSync(src, 'utf8');
	},


	checkCache: null,

	/**
	 * Returns a list of files which add additional checks to Prism functions.
	 *
	 * @returns {ReadonlyArray<string>}
	 */
	getChecks() {
		return this.checkCache = this.checkCache || getAllFiles(__dirname + '/../checks');
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
