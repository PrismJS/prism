import { resolveAlias } from './shared/meta/alias-data.js';
import { knownLanguages } from './shared/meta/all-languages-data.js';
import { toArray } from './util/iterables.js';

/**
 * @param {string} dir
 * @param {string} file
 * @returns {string}
 */
function pathJoin (dir, file) {
	return dir.replace(/\/$/, '') + '/' + file;
}

/** @type {Map<string, Promise>} */
const importCache = new Map();

/**
 * @template T
 * @param {string} file
 * @returns {Promise<T>}
 */
function importFile (file) {
	let promise = importCache.get(file);
	if (promise === undefined) {
		promise = import(file);
		importCache.set(file, promise);
	}
	return promise;
}

/**
 * Loads the given languages and adds them to the given Prism instance.
 *
 * If no languages are provided, __all__ Prism languages will be loaded.
 *
 * @param {Prism} Prism
 * @param {string | string[]} [languages] Defaults to all known languages.
 * @param {string} [srcPath='.']
 * @returns {Promise}
 */
export async function loadLanguages (Prism, languages = knownLanguages, srcPath = '.') {
	languages = toArray(languages)
		.map(resolveAlias)
		.filter(id => !Prism.components.has(id));

	await Promise.all(
		languages.map(async id => {
			try {
				const path = pathJoin(srcPath, `languages/${id}.js`);
				/** @type {{ default: ComponentProto }} */
				const exports = await importFile(path);
				Prism.components.add(exports.default);
			}
			catch (error) {
				if (!loadLanguages.silent) {
					console.warn(`Unable to load language ${id}: ${String(error)}`);
				}
			}
		})
	);
}

/**
 * Set this to `true` to prevent all warning messages `loadLanguages` logs.
 */
loadLanguages.silent = false;

/**
 * @typedef {import('./core.js').Prism} Prism
 * @typedef {import('./types.d.ts').ComponentProto} ComponentProto
 */
