import { resolveAlias } from './shared/meta/alias-data';
import { knownLanguages } from './shared/meta/all-languages-data';
import { toArray } from './shared/util';
import type { Prism } from './core';
import type { ComponentProto } from './types';

function pathJoin(dir: string, file: string) {
	return dir.replace(/\/$/, '') + '/' + file;
}

const importCache = new Map<string, Promise<unknown>>();
function importFile<T>(file: string): Promise<T> {
	let promise = importCache.get(file);
	if (promise === undefined) {
		promise = import(file);
		importCache.set(file, promise);
	}
	return promise as Promise<T>;
}

/**
 * Loads the given languages and adds them to the given Prism instance.
 *
 * If no languages are provided, __all__ Prism languages will be loaded.
 */
export async function loadLanguages(Prism: Prism, languages: string | readonly string[] = knownLanguages, srcPath = '.'): Promise<void> {
	languages = toArray(languages)
		.map(resolveAlias)
		.filter((id) => !Prism.components.has(id));

	await Promise.all(languages.map(async (id) => {
		try {
			const path = pathJoin(srcPath, `languages/prism-${id}.js`);
			const exports = await importFile<{ default: ComponentProto }>(path);
			Prism.components.add(exports.default);
		} catch (error) {
			if (!loadLanguages.silent) {
				// eslint-disable-next-line no-undef
				console.warn(`Unable to load language ${id}: ${String(error)}`);
			}
		}
	}));
}

/**
 * Set this to `true` to prevent all warning messages `loadLanguages` logs.
 */
loadLanguages.silent = false;
