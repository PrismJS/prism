import { languageIdParts, splitLanguageId } from '../../util/language-id.js';
import ComponentRegistry from './component-registry.js';
import Language from './language.js';

/**
 * Registry of language definitions.
 *
 * Besides plain language ids and aliases, the registry understands compound ids of the form
 * `outer:inner` for meta-languages, i.e. languages that embed or produce another language
 * (definitions with an `inner` key). `diff:css` is a diff of CSS, `django:css` is a Django
 * template producing CSS, and `diff:django:css` is a diff of that.
 *
 * Compound ids are normalized: aliases are resolved per part, an inner language equal to the
 * declared default is dropped (`django:markup` → `django`) and `:none` on a language without
 * a default is dropped too (`diff:none` → `diff`).
 */
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
	 * @returns {ResolvedRef}
	 */
	resolveRef (ref) {
		if (ref instanceof Language) {
			return { id: ref.id, def: ref.def, language: ref };
		}

		if (typeof ref === 'object') {
			const id = ref.id;
			return { id, def: ref, language: this.instances[id] };
		}

		if (typeof ref !== 'string') {
			throw new Error(`Invalid argument type: ${ref}`);
		}

		const [outer, rest] = splitLanguageId(ref);
		let id = this.aliases[outer] ?? outer;
		const def = this.cache[id];

		if (rest === undefined) {
			return { id, def, language: this.instances[id] };
		}

		// Compound id: resolve the inner part recursively so that aliases are normalized
		const inner = rest === 'none' ? null : this.resolveRef(rest).id;

		if (def && def.inner !== undefined && inner === (def.inner?.id ?? null)) {
			// The inner language is the default one, so this is just the plain language
			return { id, def, language: this.instances[id] };
		}

		id = `${id}:${inner ?? 'none'}`;
		return { id, def, language: this.instances[id], inner };
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

		// Only plain instances are keyed by definition; derived instances (`a:b`) are not
		if (def && id === def.id && this.defs.has(def)) {
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
	 * For compound ids (`outer:inner`), a derived language instance is created that embeds
	 * the inner language. This requires the outer language to be a meta-language (have an
	 * `inner` key) and the inner language to be loaded.
	 *
	 * @param {string | Language | LanguageProto} ref
	 * @returns {Language | null}
	 */
	getLanguage (ref) {
		const languageOrDef = this.peek(ref);

		if (languageOrDef instanceof Language) {
			return languageOrDef;
		}

		const { id, def, inner } = this.resolveRef(ref);

		if (!def) {
			return null;
		}

		if (inner !== undefined) {
			// Compound id
			if (def.inner === undefined) {
				// Not a meta-language
				return null;
			}

			const innerLanguage = inner === null ? null : this.getLanguage(inner);
			if (inner !== null && !innerLanguage) {
				// Inner language not loaded
				return null;
			}

			const language = new Language(def, this, { id, inner: innerLanguage });
			this.instances[id] = language;
			return language;
		}

		// NOTE: this will overwrite any existing language with the same id
		// We can add an option to prevent this in the future
		const language = new Language(def, this);
		this.defs.set(def, language);
		this.instances[def.id] = language;
		return language;
	}

	/**
	 * Whether the given language id (or alias, or compound id) can be resolved to a grammar
	 * with the currently loaded definitions.
	 *
	 * @param {string} id
	 * @returns {boolean}
	 */
	has (id) {
		const { def, inner } = this.resolveRef(id);

		if (!def) {
			return false;
		}

		if (inner === undefined) {
			return true;
		}

		if (def.inner === undefined) {
			return false;
		}

		return inner === null || this.has(inner);
	}

	/**
	 * Load a language definition by id. Compound ids (`outer:inner`) load all their parts.
	 *
	 * @param {string} id
	 * @returns {LanguageProto | Promise<LanguageProto | null>}
	 */
	load (id) {
		const parts = languageIdParts(id).filter(part => part !== 'none');

		if (parts.length <= 1) {
			return super.load(parts[0] ?? id);
		}

		return Promise.all(parts.map(part => super.load(part))).then(protos => protos[0]);
	}
}

/** @import { LanguageProto, Languages } from '../../types.d.ts' */

/**
 * @typedef {object} ResolvedRef
 * @property {string} id The normalized id
 * @property {LanguageProto} [def] The definition of the (outer) language, if loaded
 * @property {Language} [language] The language instance, if already resolved
 * @property {string | null} [inner] For compound ids: the normalized id of the inner language,
 * or `null` for `none`. `undefined` for plain ids.
 */
