import ComponentRegistry from './component-registry.js';
import Language from './language.js';

export default class LanguageRegistry extends ComponentRegistry {
	static type = 'language';

	/** @type {Record<string, string>} */
	aliases = {};

	/** @type {Languages} */
	instances = {};

	/** @type {WeakMap<LanguageProto, Language>} */
	defs = new WeakMap();

	/**
	 * Add a language definition to the registry.
	 * This does not necessarily resolve the language.
	 *
	 * @param {LanguageProto} def
	 * @returns {boolean}
	 */
	add (def) {
		const added = super.add(def);

		if (added) {
			if (def.alias) {
				const id = def.id;

				if (typeof def.alias === 'string') {
					this.aliases[def.alias] = id;
				}
				else if (Array.isArray(def.alias)) {
					for (const alias of def.alias) {
						this.aliases[alias] = id;
					}
				}
			}

			def.effect?.(this.prism);
		}

		return added;
	}

	/**
	 * @param {string | LanguageProto | Language} ref
	 * @returns { {
			id: string;
			def: LanguageProto;
			language?: Language;
		} }
	 */
	resolveRef (ref) {
		if (ref instanceof Language) {
			return { id: ref.id, def: ref.def, language: ref };
		}

		/** @type {string} */
		let id;

		/** @type {LanguageProto} */
		let def;

		if (typeof ref === 'object') {
			def = ref;
			id = def.id;
		}
		else if (typeof ref === 'string') {
			id = ref;
		}
		else {
			throw new Error(`Invalid argument type: ${ref}`);
		}

		id = this.aliases[id] ?? id;
		def ??= this.cache[id];
		const language = this.instances[id];

		return { id, def, language };
	}

	/**
	 * Get resolved language, language definition or null if it doesn't exist.
	 * If definition is loaded but not yet resolved, it will NOT be resolved. Use {@link getLanguage} for that.
	 *
	 * @param {string | Language | LanguageProto} ref Language id or definition
	 * @returns {Language | null}
	 */
	peek (ref) {
		const { id, def, language } = this.resolveRef(ref);

		if (language) {
			return language;
		}

		if (this.defs.has(def)) {
			return this.defs.get(def) ?? null;
		}

		if (this.instances[id]) {
			return this.instances[id];
		}

		return null;
	}

	/**
	 * Get resolved language or null if it doesn't exist
	 * If definition is loaded but not yet resolved, it will be resolved and returned.
	 *
	 * @param {string | Language | LanguageProto} ref
	 * @returns {Language | null}
	 */
	getLanguage (ref) {
		const languageOrDef = this.peek(ref);

		if (languageOrDef instanceof Language) {
			return languageOrDef;
		}

		const { id, def } = this.resolveRef(ref);

		if (!this.cache[id]) {
			return null;
		}

		// NOTE: this will overwrite any existing language with the same id
		// We can add an option to prevent this in the future
		const language = new Language(def, this);
		this.defs.set(def, language);
		this.instances[def.id] = language;
		return language;
	}
}

/** @import { LanguageProto, Languages } from '../../types.d.ts' */
