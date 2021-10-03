'use strict';

const fs = require('fs');
const components = require('../../components.json');
const getLoader = require('../../dependencies');
const languagesCatalog = components.languages;
const coreChecks = require('./checks');


/**
 * @typedef PrismLoaderContext
 * @property {import('../../components/prism-core')} Prism The Prism instance.
 * @property {Set<string>} loaded A set of loaded components.
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
