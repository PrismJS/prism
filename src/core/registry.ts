import { kebabToCamelCase } from '../shared/util';
import { cloneGrammar } from '../util/extend';
import { forEach, toArray } from '../util/iterables';
import { extend } from '../util/language-util';
import type {
	ComponentProto,
	Grammar,
	GrammarOptions,
	GrammarOptionsWithBase,
	LanguageProto,
} from '../types';
import type { Prism } from './prism';

interface Entry {
	proto: ComponentProto;
	evaluatedGrammar?: Grammar;
	evaluatedEffect?: () => void;
}

/**
 * TODO: docs
 */
export class Registry {
	/**
	 * A map from the aliases of components to the id of the component with that alias.
	 */
	private aliasMap = new Map<string, string>();

	/**
	 * A map from the aliases of components to the id of the component with that alias.
	 */
	private entries = new Map<string, Entry>();

	private Prism: Prism;

	constructor (Prism: Prism) {
		this.Prism = Prism;
	}

	/**
	 * If the given name is a known alias, then the id of the component of the alias will be returned. Otherwise, the
	 * `name` will be returned as is.
	 */
	resolveAlias (name: string): string {
		return this.aliasMap.get(name) ?? name;
	}

	/**
	 * Returns whether this registry has a component with the given name or alias.
	 */
	has (name: string): boolean {
		return this.entries.has(this.resolveAlias(name));
	}

	add (...components: ComponentProto[]): void {
		const added = new Set<string>();

		const register = (proto: ComponentProto) => {
			const { id } = proto;
			if (this.entries.has(id)) {
				return;
			}

			this.entries.set(id, { proto });
			added.add(id);

			// add aliases
			forEach(proto.alias, alias => this.aliasMap.set(alias, id));

			if ((proto as LanguageProto).base) {
				proto.require = [
					(proto as LanguageProto).base as ComponentProto,
					...toArray(proto.require),
				];
			}

			// dependencies
			forEach(proto.require, register);

			// add plugin namespace
			if (proto.plugin) {
				this.Prism.plugins[kebabToCamelCase(id)] = proto.plugin(this.Prism as never);
			}
		};
		components.forEach(register);

		this.update(added);
	}

	private update (changed: ReadonlySet<string>): void {
		const updateCache = new Map<string, boolean>();
		const idStack: string[] = [];

		const performUpdateUncached = (id: string): boolean => {
			// check for circular dependencies
			const circularStart = idStack.indexOf(id);
			if (circularStart !== idStack.length - 1) {
				throw new Error(
					`Circular dependency ${idStack.slice(circularStart).join(' -> ')} not allowed`
				);
			}

			// check whether the component is registered
			const entry = this.entries.get(id);
			if (!entry) {
				return false;
			}

			// check whether any dependencies updated
			if (!shouldRunEffects(entry.proto)) {
				return false;
			}

			// reset
			entry.evaluatedGrammar = undefined;
			entry.evaluatedEffect?.();

			// redo effects
			entry.evaluatedEffect = entry.proto.effect?.(this.Prism as never);

			return true;
		};
		const performUpdate = (id: string): boolean => {
			let status = updateCache.get(id);
			if (status === undefined) {
				idStack.push(id);
				status = performUpdateUncached(id);
				idStack.pop();
				updateCache.set(id, status);
			}
			return status;
		};

		const shouldRunEffects = (proto: ComponentProto): boolean => {
			let depsChanged = false;

			forEach(proto.require, ({ id }) => {
				if (performUpdate(id)) {
					depsChanged = true;
				}
			});
			forEach(proto.optional, id => {
				if (performUpdate(this.resolveAlias(id))) {
					depsChanged = true;
				}
			});

			return depsChanged || changed.has(proto.id);
		};

		this.entries.forEach((_, id) => performUpdate(id));
	}

	getLanguage (id: string): Grammar | undefined {
		id = this.resolveAlias(id);

		const entry = this.entries.get(id);
		const grammar = entry?.proto.grammar;
		if (!grammar) {
			// we do not have the given component registered or the component doesn't define a grammar
			return undefined;
		}

		if (entry.evaluatedGrammar) {
			// use the cached grammar
			return entry.evaluatedGrammar;
		}

		const required = (id: string): Grammar => {
			const grammar = this.getLanguage(id);
			if (!grammar) {
				throw new Error(`The language ${id} was not found.`);
			}
			return grammar;
		};

		const base = (entry?.proto as LanguageProto).base;
		// We need this so that any code modifying the base grammar doesn't affect other instances
		const baseGrammar = base && cloneGrammar(required(base.id), base.id);

		let evaluatedGrammar: Grammar;
		if (typeof grammar === 'object') {
			// if the grammar is an object, we can use it directly
			evaluatedGrammar = grammar;
		}
		else {
			const options: GrammarOptions = {
				getLanguage: required,
				getOptionalLanguage: id => this.getLanguage(id),
				extend: (id, ref) => extend(required(id), id, ref),
				...(baseGrammar && { base: baseGrammar }),
			};

			const grammarFn = grammar as (
				options: GrammarOptions | GrammarOptionsWithBase
			) => Grammar;
			evaluatedGrammar = grammarFn(options);
		}

		if (baseGrammar) {
			evaluatedGrammar = extend(baseGrammar, base.id, evaluatedGrammar);
		}

		return (entry.evaluatedGrammar = evaluatedGrammar);
	}
}
