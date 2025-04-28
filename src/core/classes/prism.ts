import globalDefaults, { type PrismConfig } from './config';
import { Hooks } from './hooks';
import { Registry } from '../registry';
import { highlightAll, type HighlightAllOptions } from '../highlight-all';
import { highlightElement, type HighlightElementOptions } from '../highlight-element';
import { highlight, type HighlightOptions } from '../highlight';
import { tokenize } from '../tokenize';
import { nextTick, documentReady, allSettled } from '../../util';
import PluginRegistry from './plugin-registry';
import LanguageRegistry from './language-registry';
import type { Grammar, LanguageProto, PluginProto } from '../../types';
import type { TokenStream } from '../token';

/**
 * Prism class, to create Prism instances with different settings.
 * In most use cases, you just need the pre-existing Prism instance, see {@link prism}.
 */
export default class Prism {
	hooks = new Hooks();

	// TODO remove this and make sure the functionality is covered by language and plugin registries
	components = new Registry(this);
	languageRegistry: LanguageRegistry;
	pluginRegistry: PluginRegistry;

	config: PrismConfig;

	languagesReady: Promise<unknown>;
	waitFor: Promise<unknown>[] = [nextTick()];
	ready: Promise<unknown> = allSettled(this.waitFor);

	constructor (config: PrismConfig = {}) {
		this.config = Object.assign({}, globalDefaults, config);
		this.config.errorHandler ??= this.config.silent ? () => undefined : console.error;

		const reportError: (reason: any) => PromiseLike<never> = this.config.errorHandler;

		this.languageRegistry = new LanguageRegistry(this.config.languagePath ?? './languages/');
		this.pluginRegistry = new PluginRegistry(this.config.pluginPath ?? './plugins/');

		// Preload languages
		if (this.config.languages?.length > 0) {
			this.languageRegistry.loadAll(this.config.languages);
		}

		this.languagesReady = this.languageRegistry.ready;
		this.waitFor.push(this.languagesReady);

		if (this.config.plugins?.length > 0) {
			let pluginsReady = this.languagesReady
				.then(() => {
					return this.pluginRegistry.loadAll(this.config.plugins);
				})
				.catch(reportError);
			this.waitFor.push(pluginsReady);
		}

		if (!this.config.manual) {
			this.waitFor.push(documentReady());

			this.ready
				.then(() => {
					this.highlightAll();
				})
				.catch(reportError);
		}
	}

	get languages () {
		return this.languageRegistry.cache;
	}

	get plugins () {
		return this.pluginRegistry.cache;
	}

	/**
	 * Load a language by its ID.
	 */
	async loadLanguage (id: string): Promise<LanguageProto | null> {
		let language = await this.languageRegistry.load(id);

		if (language?.effect) {
			language.effect(this);
		}

		return language;
	}

	/**
	 * Load a plugin by its ID.
	 */
	async loadPlugin (id: string): Promise<PluginProto | null> {
		await this.languagesReady; // first, wait for any pending languages to load
		let plugin = await this.pluginRegistry.load(id);

		if (plugin?.effect) {
			// Call the effect function of the plugin
			plugin.effect(this);
		}

		return plugin;
	}

	/**
	 * See {@link highlightAll}.
	 */
	highlightAll (options: HighlightAllOptions = {}) {
		return highlightAll.call(this, options);
	}

	/**
	 * See {@link highlightElement}
	 */
	highlightElement (element: Element, options: HighlightElementOptions = {}) {
		return highlightElement.call(this, element, options);
	}

	/**
	 * See {@link highlight}
	 */
	highlight (text: string, language: string, options: HighlightOptions = {}): string {
		return highlight.call(this, text, language, options);
	}

	/**
	 * See {@link tokenize}
	 */
	tokenize (text: string, grammar: Grammar): TokenStream {
		return tokenize.call(this, text, grammar);
	}
}
