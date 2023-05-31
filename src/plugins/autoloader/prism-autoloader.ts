import { getParentPre } from '../../shared/dom-util';
import { resolveAlias } from '../../shared/meta/alias-data';
import { toArray } from '../../shared/util';
import type { Prism } from '../../core';
import type { ComponentProto, PluginProto } from '../../types';

function getDefaultSrcPath() {
	if (typeof document !== 'undefined') {
		const script = document.currentScript as HTMLScriptElement | null;
		if (script) {
			const autoloaderFile = /\bplugins\/autoloader\/prism-autoloader\.(?:min\.)?js(?:\?[^\r\n/]*)?$/i;
			const prismFile = /(^|\/)[\w-]+\.(?:min\.)?m?js(?:\?[^\r\n/]*)?$/i;

			const autoloaderPath = script.getAttribute('data-autoloader-path');
			if (autoloaderPath != null) {
				// data-autoloader-path is set, so just use it
				return autoloaderPath.trim().replace(/\/?$/, '/');
			} else {
				const src = script.src;
				if (autoloaderFile.test(src)) {
					// the script is the original autoloader script in the usual Prism project structure
					return src.replace(autoloaderFile, 'components/');
				} else if (prismFile.test(src)) {
					// the script is part of a bundle like a custom prism.js from the download page
					return src.replace(prismFile, '$1components/');
				}
			}
		}
	}

	return 'components/';
}

function pathJoin(dir: string, file: string) {
	return dir.replace(/\/$/, '') + '/' + file;
}

const ignoredLanguages: ReadonlySet<string> = new Set(['none']);

/**
 * @param Prism The Prism instance
 * @param name The name of the language
 */
function isLoaded(Prism: Prism, name: string) {
	// resolve alias
	const id = resolveAlias(name);
	return Prism.components.has(id) || ignoredLanguages.has(id);
}

export class Autoloader {
	srcPath = getDefaultSrcPath();

	private _importCache = new Map<string, Promise<unknown>>();
	private Prism: Prism;

	/**
	 * @package
	 */
	constructor(Prism: Prism) {
		this.Prism = Prism;
	}

	/**
	 * Loads all given languages concurrently.
	 */
	async loadLanguages(languages: string | readonly string[]): Promise<void> {
		const toLoad = toArray(languages)
			.map(resolveAlias)
			.filter((id) => !isLoaded(this.Prism, id));

		await Promise.all(toLoad.map((id) => {
			const path = pathJoin(this.srcPath, `languages/prism-${id}.js`);

			let promise = this._importCache.get(path);
			if (promise === undefined) {
				promise = import(path).then((exports) => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					const proto = exports.default as ComponentProto;
					this.Prism.components.add(proto);
				});
				this._importCache.set(path, promise);
			}
			return promise;
		}));
	}

	/**
	 * Loads all given languages concurrently.
	 *
	 * This function simply invokes {@link Autoloader#loadLanguages} and logs errors to `console.error`.
	 */
	preloadLanguages(languages: string | readonly string[]): void {
		this.loadLanguages(languages).catch((reason) => {
			console.error(`Failed to preload languages (${toArray(languages).join(', ')}): ${String(reason)}`);
		});
	}
}

export default {
	id: 'autoloader',
	plugin(Prism) {
		return new Autoloader(Prism);
	},
	effect(Prism) {
		/**
		 * Returns all additional dependencies of the given element defined by the `data-dependencies` attribute.
		 */
		function getDependencies(element: Element) {
			let deps = element.getAttribute('data-dependencies')?.trim();
			if (!deps) {
				const parent = getParentPre(element);
				if (parent) {
					deps = parent.getAttribute('data-dependencies')?.trim();
				}
			}
			return deps ? deps.split(/\s*,\s*/) : [];
		}

		/**
		 * Maps the given name to a list of components that have to be loaded.
		 */
		function mapDependency(name: string) {
			if (!name || ignoredLanguages.has(name)) {
				return [];
			} else if (/^diff-./i.test(name)) {
				// the "diff-xxxx" format is used by the Diff Highlight plugin
				return ['diff', name.slice('diff-'.length)];
			} else {
				return [name];
			}
		}

		return Prism.hooks.add('complete', ({ element, language }) => {
			if (!language || ignoredLanguages.has(language)) {
				return;
			}

			let deps = mapDependency(language);
			for (const name of getDependencies(element)) {
				deps.push(...mapDependency(name));
			}

			deps = deps.filter((name) => !isLoaded(Prism, name));
			if (deps.length === 0) {
				// all dependencies are already loaded
				return;
			}

			Prism.plugins.autoloader.loadLanguages(deps).then(
				() => Prism.highlightElement(element),
				(reason) => {
					console.error(`Failed to load languages (${deps.join(', ')}): ${String(reason)}`);
				}
			);
		});
	}
} as PluginProto<'autoloader'>;
