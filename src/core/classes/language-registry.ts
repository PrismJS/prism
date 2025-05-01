import Language, { type LanguageLike, type LanguageProto } from './language';
import ComponentRegistry from './registry';
export { type ComponentProtoBase } from './registry';

export default class LanguageRegistry extends ComponentRegistry<LanguageLike> {
	static type: string = 'language';
	aliases: Record<string, string> = {};
	instances: Record<string, Language> = {};
	defs = new Map<LanguageProto, Language>();

	/**
	 * Add a language definition to the registry.
	 * This does not necessarily resolve the language.
	 */
	add (def: LanguageProto): boolean {
		let added = super.add(def);

		if (added && def.alias) {
			let id = def.id;

			if (typeof def.alias === 'string') {
				this.aliases[def.alias] = id;
			}
			else if (Array.isArray(def.alias)) {
				for (let alias of def.alias) {
					this.aliases[alias] = id;
				}
			}
		}

		return added;
	}

	#resolveIdOrDef (idOrDef: string | LanguageProto): {id: string, def: LanguageProto} {
		let id: string;
		let def: LanguageProto;

		if (typeof idOrDef === 'object') {
			def = idOrDef;
			id = def.id;
		}
		else if (typeof idOrDef === 'string') {
			id = idOrDef;
		}
		else {
			throw new Error('Invalid argument type: ' + idOrDef);
		}

		id = this.aliases[id] ?? id;
		def ??= this.cache[id] as LanguageProto;

		return { id, def };
	}

	/**
	 * Get resolved language, language definition or null if it doesn't exist.
	 * If definition is loaded but not yet resolved, it will NOT be resolved. Use {@link get} for that.
	 * @param idOrDef - Language id or definition
	 */
	peek(idOrDef: string | LanguageProto): Language | null {
		let { id, def } = this.#resolveIdOrDef(idOrDef);

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
	 */
	get (idOrDef: string | LanguageProto): Language | null {
		let languageOrDef = this.peek(idOrDef);

		if (languageOrDef instanceof Language) {
			return languageOrDef;
		}

		let { id, def } = this.#resolveIdOrDef(idOrDef);

		if (!this.cache[id]) {
			return null;
		}

		// NOTE this will overwrite any existing language with the same id
		// We can add an option to prevent this in the future
		let language = new Language(def, this);
		this.defs.set(def, language);
		this.instances[def.id] = language;
		return language;
	}
}
