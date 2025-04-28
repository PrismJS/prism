import { extend, insertBefore } from '../../shared/language-util';
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

	get grammar (): Grammar {
		if (!this.evaluatedGrammar) {
			// Evaluate grammar
			const def = this.def;
			const grammar = this.def.grammar;

			// TODO extends should also be able to
			let baseGrammar = def.extends ? { ...def.extends } : {};

			if (typeof grammar === 'object') {
				// the grammar is a simple object, so we don't need to evaluate it
				this.evaluatedGrammar = Object.assign(baseGrammar, grammar);
			}
			else if (typeof grammar === 'function') {
				this.evaluatedGrammar = grammar.call(this);
			}

			if (this.evaluatedGrammar.$insertBefore) {
				for (let key in this.evaluatedGrammar.$insertBefore) {
					const tokens = this.evaluatedGrammar.$insertBefore[key];
					if (tokens) {
						insertBefore(this.evaluatedGrammar, key, tokens);
					}
				}
				delete this.evaluatedGrammar.$insertBefore;
			}

			if (this.evaluatedGrammar.$delete) {
				for (let key of this.evaluatedGrammar.$delete) {
					delete this.evaluatedGrammar[key];
				}
				delete this.evaluatedGrammar.$delete;
			}
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
