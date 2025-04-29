import { extend, cloneGrammar, insertBefore } from '../../shared/language-util';
import type LanguageRegistry from './language-registry';
import type { LanguageProto, Grammar } from '../../types';

export default class Language {
	def: LanguageProto;
	registry: LanguageRegistry;
	evaluatedGrammar?: Grammar;

	constructor (def: LanguageProto, registry: LanguageRegistry) {
		this.def = def;
		this.registry = registry;
	}

	get id () {
		return this.def.id;
	}

	get alias () {
		if (!this.def.alias) {
			return [];
		}

		return Array.isArray(this.def.alias) ? this.def.alias : [this.def.alias];
	}

	get base () {
		return this.def.base ?? null;
	}

	get extends () {
		if (!this.def.extends) {
			return [];
		}
		return Array.isArray(this.def.extends) ? this.def.extends : [this.def.extends];
	}

	get grammar (): Grammar {
		if (!this.evaluatedGrammar) {
			// Evaluate grammar
			const def = this.def;

			let { id, grammar } = def;

			if (typeof grammar === 'function') {
				grammar = grammar.call(this);
			}

			if (def.base) {
				grammar = extend(def.base, id, grammar);
			}

			this.evaluatedGrammar = grammar;
		}

		return this.evaluatedGrammar;
	}

	get effect () {
		return this.def.effect;
	}

	getLanguage (id: string): Grammar | undefined {
		// TODO implement this or eliminate the need for it
		return this.registry.get(id);
	}

	getOptionalLanguage (id: string): Grammar | undefined {
		// TODO implement this or eliminate the need for it
		return this.registry.get(id);
	}
}
