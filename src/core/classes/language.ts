import { extend, cloneGrammar, resolveGrammar } from '../../shared/language-util';
import type LanguageRegistry from './language-registry';
import type { ComponentProtoBase } from './language-registry';
import type { Grammar, GrammarOptions } from '../../types';
import List from './list';
import { defineLazyProperty } from '../../util/objects';

export default class Language extends EventTarget {
	def: LanguageProto;
	registry: LanguageRegistry;
	evaluatedGrammar?: Grammar;
	require: List<LanguageLike> = new List();
	optional: List<string> = new List();
	languages : Languages = {};

	constructor (def: LanguageProto, registry: LanguageRegistry) {
		super();
		this.def = def;
		this.registry = registry;

		if (this.def.base) {
			this.require.add(this.def.base);
		}
		if (this.def.require) {
			this.require.addAll(this.def.require);
		}

		for (let def of this.require) {
			let language = this.registry.peek(def);
			if (language) {
				// Already resolved
				this.languages[def.id] = language;
			}
			else {
				this.registry.add(def);
				defineLazyProperty(this.languages, def.id, () => {
					return this.registry.get(def.id)!;
				});
			}
		}

		if (this.def.optional) {
			this.optional.addAll(this.def.optional);

			if (this.optional.size > 0) {
				for (let optionalLanguageId of this.optional) {
					if (!this.registry.has(optionalLanguageId)) {
						this.registry.whenDefined(optionalLanguageId).then(() => {
							// TODO
						});
					}
				}
			}
		}
		if (this.def.extends) {
			this.optional.addAll(this.def.extends);
		}

		for (let id of this.optional) {
			let language = this.registry.peek(def);
			if (language) {
				this.languages[id] = language;
			}
			else {
				this.registry.whenDefined(id).then(def => {
					defineLazyProperty(this.languages, id, () => {
						return this.registry.get(def);
					});
				});

			}
		}

		defineLazyProperty(this, 'resolvedGrammar', () => resolveGrammar(this.grammar));
	}

	resolve() {

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
				languages: this.languages,
				getLanguage: (id: string) => {
					return this.registry.get(id);
				},
			});
		}

		if (base) {
			grammar = extend(base.grammar, id, grammar);
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
	alias?: string | readonly string[];
	grammar: Grammar | ((options?: GrammarOptions) => Grammar);
	plugin?: undefined;
	base?: LanguageLike;
	extends?: string | readonly string[];
}

export type Languages = Record<string, Language>;
export type LanguageLike = Language | LanguageProto;
