'use strict';
const fs = require('fs');
const { JSDOM } = require('jsdom');
const components = require('../../components.json');
const getLoader = require('../../dependencies');
const coreChecks = require('./checks');
const { languages: languagesCatalog, plugins: pluginsCatalog } = components;


/**
 * @typedef {import('../../components/prism-core')} Prism
 */

/**
 * @typedef PrismLoaderContext
 * @property {Prism} Prism The Prism instance.
 * @property {Set<string>} loaded A set of loaded components.
 */

/**
 * @typedef {import("jsdom").DOMWindow & { Prism: Prism }} PrismWindow
 *
 * @typedef PrismDOM
 * @property {JSDOM} dom
 * @property {PrismWindow} window
 * @property {Document} document
 * @property {Prism} Prism
 * @property {(languages: string | string[]) => void} loadLanguages
 * @property {(plugins: string | string[]) => void} loadPlugins
 */

/** @type {Map<string, string>} */
const fileSourceCache = new Map();
/** @type {() => any} */
let coreSupplierFunction = null;
/** @type {Map<string, (Prism: any) => void>} */
const languageCache = new Map();

module.exports = {

	/**
	 * Creates a new Prism instance with the given language loaded
	 *
	 * @param {string|string[]} languages
	 * @returns {import('../../components/prism-core')}
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
	 * Creates a new JavaScript DOM instance with Prism being loaded.
	 *
	 * @returns {PrismDOM}
	 */
	createPrismDOM() {
		const dom = new JSDOM(``, {
			runScripts: 'outside-only'
		});
		const window = dom.window;

		window.self = window; // set self for plugins
		window.eval(this.loadComponentSource('core'));

		/** The set of loaded languages and plugins */
		const loaded = new Set();

		/**
		 * Loads the given languages or plugins.
		 *
		 * @param {string | string[]} languagesOrPlugins
		 */
		const load = (languagesOrPlugins) => {
			getLoader(components, toArray(languagesOrPlugins), [...loaded]).load(id => {
				let source;
				if (languagesCatalog[id]) {
					source = this.loadComponentSource(id);
				} else if (pluginsCatalog[id]) {
					source = this.loadPluginSource(id);
				} else {
					throw new Error(`Language or plugin '${id}' not found.`);
				}

				window.eval(source);
				loaded.add(id);
			});
		};

		return {
			dom,
			window: /** @type {PrismWindow} */ (window),
			document: window.document,
			Prism: window.Prism,
			loadLanguages: load,
			loadPlugins: load,
		};
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
		getLoader(components, toArray(languages), [...context.loaded]).load(id => {
			if (!languagesCatalog[id]) {
				throw new Error(`Language '${id}' not found.`);
			}

			// get the function which adds the language from cache
			let languageFunction = languageCache.get(id);
			if (languageFunction === undefined) {
				// make a function from the code which take "Prism" as an argument, so the language grammar
				// references the function argument
				const func = new Function('Prism', this.loadComponentSource(id));
				languageCache.set(id, languageFunction = (Prism) => func(Prism));
			}
			languageFunction(context.Prism);

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
		if (!coreSupplierFunction) {
			const source = this.loadComponentSource('core');
			// Core exports itself in 2 ways:
			//  1) it uses `module.exports = Prism` which what we'll use
			//  2) it uses `global.Prism = Prism` which we want to sabotage to prevent leaking
			const func = new Function('module', 'global', source);
			coreSupplierFunction = () => {
				const module = {
					// that's all we care about
					exports: {}
				};
				func(module, {});
				return module.exports;
			};
		}
		const Prism = coreSupplierFunction();
		coreChecks(Prism);
		return Prism;
	},

	/**
	 * Loads the given component's file source as string
	 *
	 * @private
	 * @param {string} name
	 * @returns {string}
	 */
	loadComponentSource(name) {
		return this.loadFileSource(__dirname + '/../../components/prism-' + name + '.js');
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
		let content = fileSourceCache.get(src);
		if (content === undefined) {
			fileSourceCache.set(src, content = fs.readFileSync(src, 'utf8'));
		}
		return content;
	}
};

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
