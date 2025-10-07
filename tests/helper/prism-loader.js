import { readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';
import { Prism } from '../../src/core/prism.js';
import { isNonNull, lazy, noop } from '../../src/shared/util.js';
import { toArray } from '../../src/util/iterables.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, '../../src');

export const getLanguageIds = lazy(() => {
	const files = readdirSync(path.join(SRC_DIR, 'languages'));
	return files
		.map(f => {
			const match = /^([\w-]+)\.[jt]s$/.exec(f);
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
 * @returns {Promise<ComponentProto>}
 */
async function getComponentUncached (id) {
	if (getPluginIds().includes(id)) {
		const file = path.join(SRC_DIR, 'plugins', id, `${id}.js`);
		const exports = await import(file);
		return exports.default;
	}
	else {
		const file = path.join(SRC_DIR, 'languages', `${id}.js`);
		const exports = await import(file);
		return exports.default;
	}
}

/**
 * @typedef {import('../../src/types.d.ts').ComponentProto} ComponentProto
 */
/** @type {Map<string, Promise<ComponentProto>>} */
const componentCache = new Map();

/**
 * @param {string} id
 * @returns {Promise<ComponentProto>}
 */
export function getComponent (id) {
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
 * Creates a new Prism instance with the given language loaded.
 *
 * @param {string|string[]} [languages]
 */
export async function createInstance (languages) {
	const instance = new Prism();

	const protos = await Promise.all(toArray(languages).map(getComponent));
	instance.components.add(...protos);

	return instance;
}

/**
 * @param {object} target
 * @param {object} source
 */
function overwriteProps (target, source) {
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
export function createPrismDOM () {
	const dom = new JSDOM(``, {
		runScripts: 'outside-only',
		url: 'https://example.com/test.html',
	});
	const window = dom.window;

	const instance = new Prism();
	window.Prism = instance;

	/**
	 * @param {function(): void} fn
	 */
	const withGlobals = fn => {
		const g = global;
		let undo;
		try {
			const globals = {
				window,
				document: window.document,
				location: window.location,
				getComputedStyle: window.getComputedStyle,
				setTimeout: noop,
			};

			// Set up navigator separately to make it writable (it's read-only in Node.js)
			Object.defineProperty(g, 'navigator', {
				value: window.navigator,
				configurable: true,
				writable: true,
			});

			undo = overwriteProps(g, globals);
			fn();
		}
		finally {
			undo?.();
			// Clean up navigator property
			delete (/** @type {Partial<typeof global>} */ (g).navigator);
		}
	};

	/**
	 * Loads the given languages or plugins.
	 *
	 * @param {string|string[]} languagesOrPlugins
	 */
	const load = async languagesOrPlugins => {
		const protos = await Promise.all(toArray(languagesOrPlugins).map(getComponent));
		withGlobals(() => {
			instance.components.add(...protos);
		});
	};

	return {
		dom,
		window,
		document: window.document,
		Prism: window.Prism,
		loadLanguages: load,
		loadPlugins: load,
		withGlobals,
	};
}

/** @typedef {import('jsdom').DOMWindow} DOMWindow */

/**
 * @template T
 * @typedef {import('../types.d.ts').PrismDOM<T>} PrismDOM
 */
