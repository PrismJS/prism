import { extend } from '../../util/extend';
import { grammarPatch } from '../../util/grammar-patch';
import { deepClone, defineLazyProperty } from '../../util/objects';
import List from './list';
import type { Grammar, GrammarOptions } from '../../types';
import type LanguageRegistry from './language-registry';
import type { ComponentProtoBase } from './language-registry';

export default class Language extends EventTarget {
	def: LanguageProto;
	registry: LanguageRegistry;
	require: List<LanguageLike> = new List();
	optional: List<string | LanguageLike> = new List();
	languages: LanguageGrammars = {};
	readyState = 0;

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

		if (this.def.optional) {
			this.optional.addAll(this.def.optional);

			if (this.optional.size > 0) {
				for (let optionalLanguageId of this.optional) {
					if (!this.registry.has(optionalLanguageId as string)) {
						this.registry.whenDefined(optionalLanguageId as string).then(() => {
							// TODO
						});
					}
				}
			}
		}
		if (this.def.extends) {
			this.optional.addAll(this.def.extends);
		}

		for (let def of this.require) {
			defineLazyProperty(this.languages, def.id, () => {
				let language = this.registry.peek(def as LanguageProto);
				if (language) {
					// Already resolved
					return language.resolvedGrammar;
				}
				else {
					this.registry.add(def as LanguageProto);
					return this.registry.getLanguage(def.id)!.resolvedGrammar;
				}
			});
		}

		for (let id of this.optional as List<string>) {
			// TODO we need to update the grammar
			defineLazyProperty(
				this.languages,
				id,
				() => {
					return this.registry.getLanguage(id)!.resolvedGrammar;
				},
				this.registry.peek(id) ?? this.registry.whenDefined(id)
			);
		}
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

		let base = this.def.base;
		let language = this.registry.peek(base);
		if (language) {
			// Already resolved
			return language;
		}
		else {
			this.registry.add(base as LanguageProto);
			return this.registry.getLanguage(base.id);
		}
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
				get base () {
					return base?.resolvedGrammar;
				},
				languages: this.languages,
				getLanguage: (id: string) => {
					let language = this.languages[id] ?? this.registry.getLanguage(id);
					return language?.resolvedGrammar as Grammar ?? language;
				},
				whenDefined: (id: string) => {
					return this.registry.whenDefined(id) as unknown as Promise<Language>;
				},
			});
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
		this.readyState = 2;
		Object.defineProperty(this, 'grammar', { value: grammar, writable: true });
	}

	get resolvedGrammar () {
		let ret = grammarPatch(this.grammar);
		return (this.resolvedGrammar = ret);
	}

	set resolvedGrammar (grammar: Grammar) {
		this.readyState = 3;
		Object.defineProperty(this, 'resolvedGrammar', { value: grammar, writable: true });
	}
}

export interface LanguageProto<Id extends string = string> extends ComponentProtoBase<Id> {
	media?: string | readonly string[];
	extensions?: string | readonly string[];
	alias?: string | readonly string[];
	grammar: Grammar | ((options: GrammarOptions) => Grammar);
	plugin?: undefined;
	base?: LanguageLike;
	extends?: string | LanguageLike | readonly (string | LanguageLike)[];
}

export type { Language };
export type Languages = Record<string, Language>;
export type LanguageGrammars = Record<string, Grammar>;
export type LanguageLike = Language | LanguageProto;
