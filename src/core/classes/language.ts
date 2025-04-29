import { extend, cloneGrammar, resolveGrammar } from '../../shared/language-util';
import type LanguageRegistry from './language-registry';
import type { ComponentProtoBase } from './language-registry';
import type { Grammar, GrammarOptions } from '../../grammar';

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

	get base (): Language | null {
		if (!this.def.base) {
			return null;
		}

		return this.registry.get(this.def.base.id) ?? null;
	}

	get extends () {
		if (!this.def.extends) {
			return [];
		}
		return Array.isArray(this.def.extends) ? this.def.extends : [this.def.extends];
	}

	get grammar (): Grammar {
		// Lazily evaluate grammar
		const def = this.def;

		let { id, grammar } = def;
		let base = this.base;

		if (typeof grammar === 'function') {
			grammar = grammar.call(this, {
				base,
				getLanguage (id: string) {
					return this.registry.get(id);
				},
			});
		}

		if (base) {
			grammar = extend(base, id, grammar);
		}

		if (def.grammar === grammar) {
			// We need these to be separate so that any code modifying them doesn't affect other instances
			grammar = cloneGrammar(grammar, id);
		}

		// This will replace the getter with a writable property
		return (this.grammar = grammar);
	}

	set grammar (grammar: Grammar) {
		Object.defineProperty(this, 'grammar', { value: grammar, writable: true });
	}

	get effect () {
		return this.def.effect;
	}

	get resolvedGrammar () {
		return (this.resolvedGrammar = resolveGrammar(this.grammar));
	}

	set resolvedGrammar (resolvedGrammar: Grammar) {
		Object.defineProperty(this, 'resolvedGrammar', { value: resolvedGrammar, writable: true });
	}
}

export interface LanguageProto<Id extends string = string> extends ComponentProtoBase<Id> {
	grammar: Grammar | ((options?: GrammarOptions) => Grammar);
	plugin?: undefined;
	base?: LanguageLike;
	extends?: string | readonly string[];
}

export type LanguageLike = Language | LanguageProto;
