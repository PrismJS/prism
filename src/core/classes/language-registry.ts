import Language from './language';
import ComponentRegistry, { type ComponentRegistryOptions } from './registry';
import type { LanguageProto } from '../../types';

export default class LanguageRegistry extends ComponentRegistry<LanguageProto> {
	aliases: Record<string, string> = {};
	instances: Record<string, Language> = {};

	add (id: string, language: LanguageProto) {
		super.add(id, language);

		this.instances[id] ??= new Language(language, this);
	}

	get (id: string): LanguageProto | null {
		if (this.cache[id]) {
			return this.cache[id];
		}

		if (this.aliases[id]) {
			return this.cache[this.aliases[id]];
		}

		return null;
	}
}
