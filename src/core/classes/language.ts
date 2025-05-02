import { extend } from '../../util/extend';
import { deepClone, defineLazyProperty } from '../../util/objects';
import { resolveGrammar } from '../../util/resolve-grammar';
import List from './list';
import type { Grammar, GrammarOptions } from '../../types';
import type LanguageRegistry from './language-registry';
import type { ComponentProtoBase } from './language-registry';

export default class Language extends EventTarget {
	def: LanguageProto;
	registry: LanguageRegistry;
	evaluatedGrammar?: Grammar;
	require: List<LanguageLike> = new List();
	optional: List<string> = new List();
	languages: Languages = {};

	constructor (def: LanguageProto, registry: LanguageRegistry) {
		super();
		this.def = def;
		this.registry = registry;

		if (this.def.base) {
			this.require.add(this.def.base);
		}
		if (this.def.require) {
			this.require.addAll(this.def.require as LanguageProto | readonly LanguageProto[]);
		}

		for (let def of this.require) {
			let language = this.registry.peek(def as LanguageProto);
			if (language) {
				// Already resolved
				this.languages[def.id] = language;
			}
			else {
				this.registry.add(def as LanguageProto);
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
			let language = this.registry.peek(id);
			if (language) {
				this.languages[id] = language;
			}
			else {
				this.registry.whenDefined(id).then(def => {
					defineLazyProperty(this.languages, id, () => {
						return this.registry.get(def as LanguageProto) as Language;
					});
				});
			}
		}

		defineLazyProperty(this, 'resolvedGrammar', () => resolveGrammar(this.grammar));
	}

	resolve () {}

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

		let { grammar } = def;
		let base = this.base;

		if (typeof grammar === 'function') {
			grammar = grammar.call(this, {
				base,
				languages: this.languages,
				getLanguage: (id: string) => {
					return this.registry.get(id);
				},
			} as GrammarOptions);
		}

		if (base) {
			grammar = extend(base.grammar, grammar);
		}

		if (def.grammar === grammar) {
			// We need these to be separate so that any code modifying them doesn't affect other instances
			grammar = deepClone(grammar);
		}

		// This will replace the getter with a writable property
		return (this.grammar = grammar as Grammar);
	}

	set grammar (grammar: Grammar) {
		Object.defineProperty(this, 'grammar', { value: grammar, writable: true });
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

export type { Language };
export type Languages = Record<string, Language>;
export type LanguageLike = Language | LanguageProto;
