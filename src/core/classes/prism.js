import { allSettled, nextTick } from '../../util/async.js';
import { highlightAll } from '../highlight-all.js';
import { highlightElement } from '../highlight-element.js';
import { highlight } from '../highlight.js';
import { tokenize } from '../tokenize/tokenize.js';
import { Hooks } from './hooks.js';
import LanguageRegistry from './language-registry.js';
import PluginRegistry from './plugin-registry.js';

/**
 * Prism class, to create Prism instances with different settings.
 * In most use cases, you just need the pre-existing Prism instance, see {@link prism}.
 */
export default class Prism {
	/**
	 * The version of Prism, such as `2.0.0`. The build fills it in, so unbuilt source has `dev`.
	 */
	static version = /* version_placeholder[ */ 'dev' /* ] */;

	/**
	 * Checks whether `value` is a Prism instance, even one from another copy of Prism,
	 * such as the IIFE build and an ESM import.
	 * `instanceof` and `#private` fields miss an instance of another copy, because each copy has its own class.
	 * So the check looks for `isPrism` on the value's class: every copy of the class has this method.
	 *
	 * @param {any} value
	 * @returns {value is Prism}
	 */
	static isPrism (value) {
		return typeof value?.constructor?.isPrism === 'function';
	}

	/**
	 * @type {Hooks}
	 */
	hooks = new Hooks();

	/**
	 * @type {LanguageRegistry}
	 */
	languageRegistry;

	/**
	 * @type {PluginRegistry}
	 */
	pluginRegistry;

	/**
	 * @type {PrismConfig}
	 */
	config;

	/**
	 * The registry the languages and plugins add themselves to on import, if this is the global instance.
	 *
	 * @type {ComponentRegistry<ComponentProto> | undefined}
	 */
	registry;

	/**
	 * @type {Promise<unknown>[]}
	 */
	waitFor = [nextTick()];

	/**
	 * @type {Promise<unknown>}
	 */
	ready = allSettled(this.waitFor);

	/**
	 * @param {PrismConfig} [config={}]
	 */
	constructor (config = {}) {
		this.config = { ...config };

		this.config.errorHandler ??= /** @type {PrismConfig['errorHandler']} */ (
			this.config.silent ? () => undefined : console.error
		);

		const reportError = this.config.errorHandler;

		this.languageRegistry = new LanguageRegistry({
			path: this.config.languagePath ?? './languages/',
			preload: this.config.languages,
			prism: this,
		});

		this.pluginRegistry = new PluginRegistry({
			path: this.config.pluginPath ?? './plugins/',
			prism: this,
		});

		this.languagesReady = this.languageRegistry.ready;
		this.waitFor.push(this.languagesReady);

		// Preload plugins
		const plugins = this.config.plugins;
		if (plugins && plugins.length > 0) {
			const pluginsReady = this.languagesReady
				.then(() => this.waitFor.push(...this.pluginRegistry.loadAll(plugins)))
				.catch(reportError);
			this.waitFor.push(pluginsReady);
		}
	}

	get languages () {
		return this.languageRegistry.cache;
	}

	get plugins () {
		return this.pluginRegistry.cache;
	}

	/**
	 * Registers a language or plugin with this instance.
	 *
	 * @param {ComponentProto} def
	 * @returns {boolean} `false` if it was already registered
	 */
	register (def) {
		// Only languages have a grammar
		if (def.grammar) {
			return this.languageRegistry.add(def);
		}

		return this.pluginRegistry.add(def);
	}

	/**
	 * Load a language by its id.
	 *
	 * @param {string} id
	 * @returns {Promise<Language | LanguageProto | null>}
	 */
	async loadLanguage (id) {
		const language = await this.languageRegistry.load(id);

		return language;
	}

	/**
	 * Load a plugin by its id.
	 *
	 * @param {string} id
	 * @returns {Promise<PluginProto | null>}
	 */
	async loadPlugin (id) {
		await this.languagesReady; // first, wait for any pending languages to load
		const plugin = await this.pluginRegistry.load(id);

		return plugin;
	}

	/**
	 * See {@link highlightAll}.
	 *
	 * @param {HighlightAllOptions} [options]
	 */
	highlightAll (options = {}) {
		return highlightAll.call(this, options);
	}

	/**
	 * See {@link highlightElement}
	 *
	 * @param {Element} element
	 * @param {HighlightElementOptions} [options]
	 */
	highlightElement (element, options = {}) {
		return highlightElement.call(this, element, options);
	}

	/**
	 * See {@link highlight}
	 *
	 * @param {string} text
	 * @param {string} language
	 * @param {HighlightOptions} [options]
	 * @returns {string}
	 */
	highlight (text, language, options = {}) {
		return highlight.call(this, text, language, options);
	}

	/**
	 * See {@link tokenize}
	 *
	 * @param {string} text
	 * @param {Grammar} grammar
	 * @returns {TokenStream}
	 */
	tokenize (text, grammar) {
		return tokenize.call(this, text, grammar);
	}
}

/**
 * @import { HighlightAllOptions } from '../highlight-all.js';
 * @import { HighlightElementOptions } from '../highlight-element.js';
 * @import { HighlightOptions } from '../highlight.js';
 * @import ComponentRegistry from './component-registry.js';
 * @import { PrismConfig, ComponentProto, PluginProto, Language, LanguageProto, Grammar, TokenStream } from '../../types.d.ts';
 */
