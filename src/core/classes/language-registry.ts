import Language, { type LanguageLike, type LanguageProto } from './language';
import ComponentRegistry from './registry';
export { type ComponentProtoBase } from './registry';

export default class LanguageRegistry extends ComponentRegistry<LanguageLike> {
	aliases: Record<string, string> = {};
	instances: Record<string, Language> = {};

	add (id: string, def: LanguageProto) {
		super.add(id, def);
		this.instances[id] ??= new Language(def, this);
	}

	/** Get resolved language or null if it doesn't exist */
	get (id: string): Language | null {
		let canonicalId = this.aliases[id] ?? id;

		if (!this.instances[canonicalId]) {
			if (this.cache[canonicalId]) {
				let def = this.cache[canonicalId];
				let language = new Language(def as LanguageProto, this);
				this.instances[canonicalId] = language;
			}
			else {
				return null;
			}
		}

		return this.instances[canonicalId];
	}
}
