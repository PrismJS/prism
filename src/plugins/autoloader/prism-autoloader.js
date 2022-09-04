import { getParentPre } from '../../shared/dom-util';
import { toArray } from '../../shared/util';
import { knownAliases } from './alias-data';

function getDefaultSrcPath() {
	if (typeof document !== 'undefined') {
		const script = /** @type {HTMLScriptElement | null} */ (document.currentScript);
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

/**
 * @param {string} dir
 * @param {string} file
 */
function pathJoin(dir, file) {
	return dir.replace(/\/$/, '') + '/' + file;
}

/** @type {ReadonlySet<string>} */
const ignoredLanguages = new Set(['none']);

/**
 * @param {import('../../core/prism').Prism} Prism
 * @param {string} name The name of the language
 */
function isLoaded(Prism, name) {
	// resolve alias
	const id = knownAliases[name] || name;
	return Prism.components.has(id) || ignoredLanguages.has(id);
}

export class Autoloader {
	srcPath = getDefaultSrcPath();

	/**
	 * @type {Map<string, Promise<any>>}
	 * @private
	 */
	_importCache = new Map();

	/**
	 * @param {import('../../core/prism.js').Prism} Prism
	 * @package
	 */
	constructor(Prism) {
		/** @private */
		this.Prism = Prism;
	}

	/**
	 * Loads all given languages concurrently.
	 *
	 * @param {string | readonly string[]} languages
	 * @returns {Promise<void>}
	 */
	async loadLanguages(languages) {
		const toLoad = toArray(languages)
			.map(name => knownAliases[name] || name)
			.filter(id => !isLoaded(this.Prism, id));

		await Promise.all(toLoad.map((id) => {
			const path = pathJoin(this.srcPath, `languages/prism-${id}.js`);

			let promise = this._importCache.get(path);
			if (promise === undefined) {
				promise = import(path).then(exports => {
					const proto = /** @type {import('../../types').ComponentProto} */ (exports.default);
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
	 *
	 * @param {string | readonly string[]} languages
	 * @returns {void}
	 */
	preloadLanguages(languages) {
		this.loadLanguages(languages).catch(reason => {
			console.error(`Failed to preload languages (${toArray(languages).join(', ')}): ${reason}`);
		});
	}
}

export default /** @type {import("../../types").PluginProto<'autoloader'>} */ ({
	id: 'autoloader',
	plugin(Prism) {
		return new Autoloader(Prism);
	},
	effect(Prism) {
		/**
		 * Returns all additional dependencies of the given element defined by the `data-dependencies` attribute.
		 *
		 * @param {Element} element
		 * @returns {string[]}
		 */
		function getDependencies(element) {
			let deps = element.getAttribute('data-dependencies')?.trim();
			if (!deps) {
				const parent = getParentPre(element);
				if (parent) {
					deps = parent.getAttribute('data-dependencies')?.trim();
				}
			}
			return deps ? deps.split(/\s*,\s*/g) : [];
		}

		/**
		 * Maps the given name to a list of components that have to be loaded.
		 *
		 * @param {string} name
		 * @returns {string[]}
		 */
		function mapDependency(name) {
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

			deps = deps.filter(name => !isLoaded(Prism, name));
			if (deps.length === 0) {
				// all dependencies are already loaded
				return;
			}

			Prism.plugins.autoloader.loadLanguages(deps).then(
				() => Prism.highlightElement(element),
				(reason) => {
					console.error(`Failed to load languages (${deps.join(', ')}): ${reason}`);
				}
			);
		});
	}
});
