import { readdirSync } from 'fs';
import { JSDOM } from 'jsdom';
import path from 'path';
import { Prism } from '../../src/core/prism.js';
import { isNonNull, lazy, noop, toArray } from '../../src/shared/util.js';

const SRC_DIR = path.join(__dirname, '../../src');

export const getLanguageIds = lazy(() => {
	const files = readdirSync(path.join(SRC_DIR, 'languages'));
	return files
		.map((f) => {
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
async function getComponentUncached(id) {
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
/** @type {Map<string, Promise<import('../../src/types').ComponentProto>>} */
const componentCache = new Map();
/**
 * @param {string} id
 */
export function getComponent(id) {
	let promise = componentCache.get(id);
	if (promise === undefined) {
		promise = getComponentUncached(id);
		componentCache.set(id, promise);
	}
	return promise;
}

// preload all components
getComponentIds().forEach(getComponent);

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
 *
 * @param {Record<string, unknown>} target
 * @param {Record<string, unknown>} source
 * @returns {() => void}
 */
function overwriteProps(target, source) {
	/** @type {[string, unknown][]} */
	const oldProps = [];

	for (const [key, value] of Object.entries(source)) {
		oldProps.push([key, target[key]]);
		target[key] = value;
	}

	return () => {
		for (const [key, value] of oldProps) {
			target[key] = value;
		}
	};
}

/**
 * Creates a new JavaScript DOM instance with Prism being loaded.
 *
 * @returns {PrismDOM<{}>}
 */
export function createPrismDOM() {
	const dom = new JSDOM(``, {
		runScripts: 'outside-only',
		url: 'https://example.com/test.html'
	});
	const window = dom.window;

	const instance = new Prism();
	window.Prism = instance;

	/**
	 * @param {() => void} fn
	 */
	const withGlobals = (fn) => {
		const g = /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (global));
		let undo;
		try {
			undo = overwriteProps(g, {
				window,
				document: window.document,
				navigator: window.navigator,
				location: window.location,
				getComputedStyle: window.getComputedStyle,
				setTimeout: noop
			});
			fn();
		} finally {
			undo?.();
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
