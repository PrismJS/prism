import { readdirSync } from 'fs';
import { JSDOM } from 'jsdom';
import path from 'path';
import { Prism } from '../../src/core/prism';
import { isNonNull, lazy, toArray } from '../../src/shared/util';

const SRC_DIR = path.join(__dirname, '../../src');

export const getLanguageIds = lazy(() => {
	const files = readdirSync(path.join(SRC_DIR, 'languages'));
	return files
		.map(f => {
			const match = /^prism-([\w-]+)\.js$/.exec(f);
			if (!match) {
				return undefined;
			}

			const [, id] = match;
			return id;
		})
		.filter(isNonNull);
});
export const getPluginIds = lazy(() => {
	return readdirSync(path.join(SRC_DIR, 'plugins'));
});
export const getComponentIds = lazy(() => [...getLanguageIds(), ...getPluginIds()]);

/**
 * @param {string} id
 */
export async function getComponent(id) {
	if (getPluginIds().includes(id)) {
		const file = path.join(SRC_DIR, 'plugins', id, `prism-${id}.js`);
		const exports = await import(file);
		return /** @type {import('../../src/types').PluginProto} */ (exports.default);
	} else {
		const file = path.join(SRC_DIR, 'languages', `prism-${id}.js`);
		const exports = await import(file);
		return /** @type {import('../../src/types').LanguageProto} */ (exports.default);
	}
}

/**
 * Creates a new Prism instance with the given language loaded
 *
 * @param {string|string[]} [languages]
 */
export async function createInstance(languages) {
	const instance = new Prism();

	const protos = await Promise.all(toArray(languages).map(getComponent));
	instance.components.add(...protos);

	return instance;
}

/**
 * @typedef {import("jsdom").DOMWindow & { Prism: Prism & T }} PrismWindow
 * @template T
 */
/**
 * @typedef PrismDOM
 * @property {JSDOM} dom
 * @property {PrismWindow<T>} window
 * @property {Document} document
 * @property {Prism & T} Prism
 * @property {(languages: string | string[]) => Promise<void>} loadLanguages
 * @property {(plugins: string | string[]) => Promise<void>} loadPlugins
 * @property {(fn: () => void) => void} withGlobals
 * @template T
 */

/**
 * Creates a new JavaScript DOM instance with Prism being loaded.
 *
 * @returns {PrismDOM<{}>}
 */
export function createPrismDOM() {
	const dom = new JSDOM(``, {
		runScripts: 'outside-only',
	});
	const window = dom.window;

	const instance = new Prism();
	window.Prism = instance;

	/**
	 * @param {() => void} fn
	 */
	const withGlobals = (fn) => {
		const g = /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (global));
		try {
			g.window = window;
			g.document = window.document;
			g.navigator = window.navigator;
			fn();
		} finally {
			g.window = undefined;
			g.document = undefined;
			g.navigator = undefined;
		}
	};

	/**
	 * Loads the given languages or plugins.
	 *
	 * @param {string | string[]} languagesOrPlugins
	 */
	const load = async (languagesOrPlugins) => {
		const protos = await Promise.all(toArray(languagesOrPlugins).map(getComponent));
		withGlobals(() => {
			instance.components.add(...protos);
		});
	};

	return {
		dom,
		// eslint-disable-next-line object-shorthand
		window: /** @type {PrismWindow<{}>} */ (window),
		document: window.document,
		Prism: window.Prism,
		loadLanguages: load,
		loadPlugins: load,
		withGlobals
	};
}
