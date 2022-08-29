import { JSDOM } from 'jsdom';
import path from 'path';
import { Prism } from '../../src/core/prism';
import { toArray } from '../../src/shared/util';

const SRC_DIR = path.join(__dirname, '../../src');

/**
 * Creates a new Prism instance with the given language loaded
 *
 * @param {string|string[]} [languages]
 */
export async function createInstance(languages) {
	const instance = new Prism();

	const protos = await Promise.all(toArray(languages).map(async (lang) => {
		const file = path.join(SRC_DIR, 'languages', `prism-${lang}.js`);
		const exports = await import(file);
		return /** @type {import('../../src/types').LanguageProto} */ (exports.default);
	}));

	instance.components.add(...protos);

	return instance;
}

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

/**
 * Creates a new JavaScript DOM instance with Prism being loaded.
 *
 * @returns {PrismDOM}
 */
export function createPrismDOM() {
	const dom = new JSDOM(``, {
		runScripts: 'outside-only',
	});
	const window = dom.window;

	window.self = window; // set self for plugins
	window.eval(loadComponentSource('core'));

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
				source = loadComponentSource(id);
			} else if (pluginsCatalog[id]) {
				source = loadPluginSource(id);
			} else {
				throw new Error(`Language or plugin '${id}' not found.`);
			}

			window.eval(source);
			loaded.add(id);
		});
	};

	return {
		dom,
		window,
		document: window.document,
		Prism: window.Prism,
		loadLanguages: load,
		loadPlugins: load,
	};
}
