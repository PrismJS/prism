import ComponentRegistry from './component-registry';
import Language from './language';
import type { LanguageProto, Languages } from './language';

export { type ComponentProtoBase } from './component-registry';

export default class LanguageRegistry extends ComponentRegistry<LanguageProto> {
	static type: string = 'language';
	aliases: Record<string, string> = {};
	instances: Languages = {};
	defs = new WeakMap<LanguageProto, Language>();

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

	resolveRef (ref: string | LanguageProto | Language): {
		id: string;
		def: LanguageProto;
		language?: Language;
	} {
		if (ref instanceof Language) {
			return { id: ref.id, def: ref.def, language: ref };
		}

		let id: string;
		let def: LanguageProto;

		if (typeof ref === 'object') {
			def = ref;
			id = def.id;
		}
		else if (typeof ref === 'string') {
			id = ref;
		}
		else {
			// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
			throw new Error('Invalid argument type: ' + ref);
		}

		id = this.aliases[id] ?? id;
		def ??= this.cache[id];
		let language = this.instances[id];

		return { id, def, language };
	}

	/**
	 * Get resolved language, language definition or null if it doesn't exist.
	 * If definition is loaded but not yet resolved, it will NOT be resolved. Use {@link getLanguage} for that.
	 *
	 * @param ref Language id or definition
	 */
	peek (ref: string | LanguageProto | Language): Language | null {
		let { id, def, language } = this.resolveRef(ref);

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
	 */
	getLanguage (ref: string | LanguageProto | Language): Language | null {
		let languageOrDef = this.peek(ref);

		if (languageOrDef instanceof Language) {
			return languageOrDef;
		}

		let { id, def } = this.resolveRef(ref);

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
