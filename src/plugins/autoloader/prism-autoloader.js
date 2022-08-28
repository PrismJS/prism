import { getParentPre } from '../../shared/dom-util';
import { noop } from '../../shared/util';

export class Autoloader {
	/**
	 * @param {import('../../core/prism.js').Prism} Prism
	 */
	constructor(Prism) {
		this.Prism = Prism;
	}

	/**
	 * Loads all given languages concurrently.
	 *
	 * @param {string | readonly string[]} languages
	 * @returns {Promise<void>}
	 */
	loadLanguages(languages) {

	}

	/**
	 * Loads all given languages concurrently.
	 *
	 * This function simply invokes {@link Autoloader.loadLanguages} and logs errors to `console.error`.
	 *
	 * @param {string | readonly string[]} languages
	 * @returns {void}
	 */
	preloadLanguages(languages) {
		this.loadLanguages(languages).catch(reason => console.error(`Failed to preload languages: ${reason}`));
	}
}

export default /** @type {import("../../types").PluginProto<'autoloader'>} */ ({
	id: 'autoloader',
	plugin(Prism) {
		return new Autoloader(Prism);
	},
	effect(Prism) {
		if (typeof document === 'undefined') {
			return noop;
		}

		/**
		 * @typedef LangDataItem
		 * @property {{ success?: () => void, error?: () => void }[]} callbacks
		 * @property {boolean} [error]
		 * @property {boolean} [loading]
		 */
		/** @type {Object<string, LangDataItem>} */
		const lang_data = {};

		const ignored_language = 'none';
		let languages_path = 'components/';

		const script = Prism.util.currentScript();
		if (script) {
			const autoloaderFile = /\bplugins\/autoloader\/prism-autoloader\.(?:min\.)?js(?:\?[^\r\n/]*)?$/i;
			const prismFile = /(^|\/)[\w-]+\.(?:min\.)?m?js(?:\?[^\r\n/]*)?$/i;

			const autoloaderPath = script.getAttribute('data-autoloader-path');
			if (autoloaderPath != null) {
				// data-autoloader-path is set, so just use it
				languages_path = autoloaderPath.trim().replace(/\/?$/, '/');
			} else {
				const src = script.src;
				if (autoloaderFile.test(src)) {
					// the script is the original autoloader script in the usual Prism project structure
					languages_path = src.replace(autoloaderFile, 'components/');
				} else if (prismFile.test(src)) {
					// the script is part of a bundle like a custom prism.js from the download page
					languages_path = src.replace(prismFile, '$1components/');
				}
			}
		}

		const config = Prism.plugins.autoloader = {
			languages_path,
			use_minified: true,
			loadLanguages
		};


		/**
		 * Lazily loads an external script.
		 *
		 * @param {string} src
		 * @param {() => void} [success]
		 * @param {() => void} [error]
		 */
		function addScript(src, success, error) {
			const s = document.createElement('script');
			s.src = src;
			s.async = true;
			s.onload = function () {
				document.body.removeChild(s);
				success && success();
			};
			s.onerror = function () {
				document.body.removeChild(s);
				error && error();
			};
			document.body.appendChild(s);
		}

		/**
		 * Returns all additional dependencies of the given element defined by the `data-dependencies` attribute.
		 *
		 * @param {Element} element
		 * @returns {string[]}
		 */
		function getDependencies(element) {
			let deps = (element.getAttribute('data-dependencies') || '').trim();
			if (!deps) {
				const parent = getParentPre(element);
				if (parent) {
					deps = (parent.getAttribute('data-dependencies') || '').trim();
				}
			}
			return deps ? deps.split(/\s*,\s*/g) : [];
		}

		/**
		 * Returns whether the given language is currently loaded.
		 *
		 * @param {string} lang
		 * @returns {boolean}
		 */
		function isLoaded(lang) {
			if (lang.indexOf('!') >= 0) {
				// forced reload
				return false;
			}

			lang = lang_aliases[lang] || lang; // resolve alias

			if (lang in Prism.languages) {
				// the given language is already loaded
				return true;
			}

			// this will catch extensions like CSS extras that don't add a grammar to Prism.languages
			const data = lang_data[lang];
			return data && !data.error && data.loading === false;
		}

		/**
		 * Returns the path to a grammar, using the language_path and use_minified config keys.
		 *
		 * @param {string} lang
		 * @returns {string}
		 */
		function getLanguagePath(lang) {
			return config.languages_path + 'prism-' + lang + (config.use_minified ? '.min' : '') + '.js';
		}

		/**
		 * Loads all given grammars concurrently.
		 *
		 * @param {string[]|string} languages
		 * @param {(languages: string[]) => void} [success]
		 * @param {(language: string) => void} [error] This callback will be invoked on the first language to fail.
		 */
		function loadLanguages(languages, success, error) {
			if (typeof languages === 'string') {
				languages = [languages];
			}

			const total = languages.length;
			let completed = 0;
			let failed = false;

			if (total === 0) {
				if (success) {
					setTimeout(success, 0);
				}
				return;
			}

			function successCallback() {
				if (failed) {
					return;
				}
				completed++;
				if (completed === total) {
					success && success(languages);
				}
			}

			languages.forEach((lang) => {
				loadLanguage(lang, successCallback, () => {
					if (failed) {
						return;
					}
					failed = true;
					error && error(lang);
				});
			});
		}

		/**
		 * Loads a grammar with its dependencies.
		 *
		 * @param {string} lang
		 * @param {() => void} [success]
		 * @param {() => void} [error]
		 */
		function loadLanguage(lang, success, error) {
			const force = lang.indexOf('!') >= 0;

			lang = lang.replace('!', '');
			lang = lang_aliases[lang] || lang;

			function load() {
				let data = lang_data[lang];
				if (!data) {
					data = lang_data[lang] = {
						callbacks: []
					};
				}
				data.callbacks.push({
					success,
					error
				});

				if (!force && isLoaded(lang)) {
					// the language is already loaded and we aren't forced to reload
					languageCallback(lang, 'success');
				} else if (!force && data.error) {
					// the language failed to load before and we don't reload
					languageCallback(lang, 'error');
				} else if (force || !data.loading) {
					// the language isn't currently loading and/or we are forced to reload
					data.loading = true;
					data.error = false;

					addScript(getLanguagePath(lang), () => {
						data.loading = false;
						languageCallback(lang, 'success');

					}, () => {
						data.loading = false;
						data.error = true;
						languageCallback(lang, 'error');
					});
				}
			}

			const dependencies = lang_dependencies[lang];
			if (dependencies && dependencies.length) {
				loadLanguages(dependencies, load, error);
			} else {
				load();
			}
		}

		/**
		 * Runs all callbacks of the given type for the given language.
		 *
		 * @param {string} lang
		 * @param {"success" | "error"} type
		 */
		function languageCallback(lang, type) {
			if (lang_data[lang]) {
				const callbacks = lang_data[lang].callbacks;
				for (let i = 0, l = callbacks.length; i < l; i++) {
					const callback = callbacks[i][type];
					if (callback) {
						setTimeout(callback, 0);
					}
				}
				callbacks.length = 0;
			}
		}

		Prism.hooks.add('complete', (env) => {
			const element = env.element;
			const language = env.language;
			if (!element || !language || language === ignored_language) {
				return;
			}

			const deps = getDependencies(element);
			if (/^diff-./i.test(language)) {
				// the "diff-xxxx" format is used by the Diff Highlight plugin
				deps.push('diff');
				deps.push(language.substr('diff-'.length));
			} else {
				deps.push(language);
			}

			if (!deps.every(isLoaded)) {
				// the language or some dependencies aren't loaded
				loadLanguages(deps, () => {
					Prism.highlightElement(element);
				});
			}
		});
	}
});
