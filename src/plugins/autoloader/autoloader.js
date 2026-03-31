import prism from '../../global.js';
import { getParentPre } from '../../shared/dom-util.js';
import { resolveAlias } from '../../shared/meta/alias-data.js';
import { toArray } from '../../util/iterables.js';

function getDefaultSrcPath () {
	if (typeof document !== 'undefined') {
		const script = /** @type {HTMLScriptElement | null} */ (document.currentScript);
		if (script) {
			const autoloaderFile =
				/\bplugins\/autoloader\/autoloader\.(?:min\.)?js(?:\?[^\r\n/]*)?$/i;
			const prismFile = /(^|\/)[\w-]+\.(?:min\.)?m?js(?:\?[^\r\n/]*)?$/i;

			const autoloaderPath = script.getAttribute('data-autoloader-path');
			if (autoloaderPath != null) {
				// data-autoloader-path is set, so just use it
				return autoloaderPath.trim().replace(/\/?$/, '/');
			}
			else {
				const src = script.src;
				if (autoloaderFile.test(src)) {
					// the script is the original autoloader script in the usual Prism project structure
					return src.replace(autoloaderFile, '/');
				}
				else if (prismFile.test(src)) {
					// the script is part of a bundle like a custom prism.js from the download page
					return src.replace(prismFile, '$1/');
				}
			}
		}
	}

	return './';
}

/**
 * @param {string} dir
 * @param {string} file
 * @returns {string}
 */
function pathJoin (dir, file) {
	return dir.replace(/\/$/, '') + '/' + file;
}

/** @type {Set<string>} */
const ignoredLanguages = new Set(['none']);

/**
 * @param {Prism} Prism The Prism instance
 * @param {string} name The name of the language
 */
function isLoaded (Prism, name) {
	// resolve alias
	const id = Prism.languageRegistry.resolveRef(name).id;
	return Prism.languageRegistry.has(id) || ignoredLanguages.has(id);
}

export class Autoloader {
	srcPath = getDefaultSrcPath();

	/**
	 * @type {Map<string, Promise<any>>}
	 */
	_importCache = new Map();

	/**
	 * @type {Prism}
	 */
	Prism;

	/**
	 * @param {Prism} Prism
	 */
	constructor (Prism) {
		this.Prism = Prism;
	}

	/**
	 * Loads all given languages concurrently.
	 *
	 * @param {string | string[]} languages
	 * @returns {Promise<void>}
	 */
	async loadLanguages (languages) {
		const toLoad = toArray(languages)
			.map(resolveAlias)
			.filter(id => !isLoaded(this.Prism, id));

		await Promise.all(
			toLoad.map(id => {
				const path = pathJoin(this.srcPath, `languages/${id}.js`);

				let promise = this._importCache.get(path);
				if (promise === undefined) {
					promise = import(path).then(exports => {
						/** @type {import('../../types.d.ts').LanguageProto} */
						const proto = exports.default;
						this.Prism.languageRegistry.add(proto);
					});
					this._importCache.set(path, promise);
				}
				return promise;
			})
		);
	}

	/**
	 * Loads all given languages concurrently.
	 *
	 * This function simply invokes {@link Autoloader#loadLanguages} and logs errors to `console.error`.
	 *
	 * @param {string | string[]} languages
	 * @returns {void}
	 */
	preloadLanguages (languages) {
		this.loadLanguages(languages).catch(reason => {
			console.error(
				`Failed to preload languages (${toArray(languages).join(', ')}): ${String(reason)}`
			);
		});
	}
}

/** @type {import('../../types.d.ts').PluginProto<'autoloader'>} */
const Self = {
	id: 'autoloader',
	plugin (Prism) {
		return new Autoloader(Prism);
	},
	effect (Prism) {
		/**
		 * Returns all additional dependencies of the given element defined by the `data-dependencies` attribute.
		 *
		 * @param {Element} element
		 * @returns {string[]}
		 */
		function getDependencies (element) {
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
		 *
		 * @param {string} name
		 * @returns {string[]}
		 */
		function mapDependency (name) {
			if (!name || ignoredLanguages.has(name)) {
				return [];
			}
			else if (/^diff-./i.test(name)) {
				// the "diff-xxxx" format is used by the Diff Highlight plugin
				return ['diff', name.slice('diff-'.length)];
			}
			else {
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

			/** @type {Autoloader} */
			const autoloader = Prism.pluginRegistry.peek(Self)?.plugin;
			autoloader.loadLanguages(deps).then(
				() => Prism.highlightElement(element),
				reason => {
					console.error(
						`Failed to load languages (${deps.join(', ')}): ${String(reason)}`
					);
				}
			);
		});
	},
};

export default Self;

prism.pluginRegistry.add(Self);

/**
 * @typedef {import('../../core.js').Prism} Prism
 */
