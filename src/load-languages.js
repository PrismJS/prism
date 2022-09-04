import { resolveAlias } from './shared/meta/alias-data';
import { knownLanguages } from './shared/meta/all-languages-data';
import { toArray } from './shared/util';

/**
 * @param {string} dir
 * @param {string} file
 */
function pathJoin(dir, file) {
	return dir.replace(/\/$/, '') + '/' + file;
}

/**
 * @type {Map<string, Promise<any>>}
 */
const importCache = new Map();

/**
 * @param {string} file
 * @returns {Promise<T>}
 * @template T
 */
function importFile(file) {
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
 * @param {import('./core/prism').Prism} Prism
 * @param {string | readonly string[]} [languages]
 * @param {string} [srcPath]
 * @returns {Promise<void>}
 */
export async function loadLanguages(Prism, languages = knownLanguages, srcPath = '.') {
	languages = toArray(languages)
		.map(resolveAlias)
		.filter(id => !Prism.components.has(id));

	await Promise.all(languages.map(async (id) => {
		try {
			const path = pathJoin(srcPath, `languages/prism-${id}.js`);
			const exports = await importFile(path);
			Prism.components.add(exports.default);
		} catch (error) {
			if (!loadLanguages.silent) {
				// eslint-disable-next-line no-undef
				console.warn(`Unable to load language ${id}: ${error}`);
			}
		}
	}));
}

/**
 * Set this to `true` to prevent all warning messages `loadLanguages` logs.
 *
 * @type {boolean}
 */
loadLanguages.silent = false;
