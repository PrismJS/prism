import { extend } from '../shared/language-util';
import { forEach, kebabToCamelCase } from '../shared/util';
import type { ComponentProto, Grammar } from '../types';
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

	constructor(Prism: Prism) {
		this.Prism = Prism;
	}

	/**
	 * If the given name is a known alias, then the id of the component of the alias will be returned. Otherwise, the
	 * `name` will be returned as is.
	 */
	resolveAlias(name: string): string {
		return this.aliasMap.get(name) ?? name;
	}

	/**
	 * Returns whether this registry has a component with the given name or alias.
	 */
	has(name: string): boolean {
		return this.entries.has(this.resolveAlias(name));
	}

	add(...components: ComponentProto[]): void {
		const added = new Set<string>();

		const register = (proto: ComponentProto) => {
			const { id } = proto;
			if (this.entries.has(id)) {
				return;
			}

			this.entries.set(id, { proto });
			added.add(id);

			// add aliases
			forEach(proto.alias, (alias) => this.aliasMap.set(alias, id));

			// dependencies
			forEach(proto.require, register);

			// add plugin namespace
			if ('plugin' in proto && proto.plugin) {
				this.Prism.plugins[kebabToCamelCase(id)] = proto.plugin(this.Prism as never);
			}
		};
		components.forEach(register);

		this.update(added);
	}

	private update(changed: ReadonlySet<string>): void {
		const updateStatus = new Map<string, boolean>();
		const idStack: string[] = [];

		const didUpdate = (id: string): boolean => {
			let status = updateStatus.get(id);
			if (status !== undefined) {
				return status;
			}

			let entry;
			try {
				idStack.push(id);

				const circularStart = idStack.indexOf(id);
				if (circularStart !== idStack.length - 1) {
					throw new Error(`Circular dependency ${idStack.slice(circularStart).join(' -> ')} not allowed`);
				}

				entry = this.entries.get(id);

				// eslint-disable-next-line no-use-before-define
				if (!entry || !shouldRunEffects(entry.proto)) {
					updateStatus.set(id, status = false);
					return status;
				}
			} finally {
				idStack.pop();
			}

			// reset
			entry.evaluatedGrammar = undefined;
			if (entry.evaluatedEffect) {
				entry.evaluatedEffect();
			}

			// redo effects
			if (entry.proto.effect) {
				entry.evaluatedEffect = entry.proto.effect(this.Prism as never);
			}

			updateStatus.set(id, status = true);
			return status;
		};
		const shouldRunEffects = (proto: ComponentProto): boolean => {
			let depsChanged = false;

			forEach(proto.require, ({ id }) => {
				if (didUpdate(id)) {
					depsChanged = true;
				}
			});
			forEach(proto.optional, (id) => {
				if (didUpdate(this.resolveAlias(id))) {
					depsChanged = true;
				}
			});

			return depsChanged || changed.has(proto.id);
		};

		this.entries.forEach((_, id) => didUpdate(id));
	}

	getLanguage(id: string): Grammar | undefined {
		id = this.resolveAlias(id);

		const entry = this.entries.get(id);
		if (!entry) {
			return undefined;
		}
		if (entry.evaluatedGrammar) {
			return entry.evaluatedGrammar;
		}

		if (!('grammar' in entry.proto)) {
			// languages may require plugins for effects, so we just define that plugins have no grammar
			return undefined;
		}

		const grammar = entry.proto.grammar;
		if (typeof grammar === 'object') {
			return entry.evaluatedGrammar = grammar;
		}

		const required = (id: string) => {
			const grammar = this.getLanguage(id);
			if (!grammar) {
				throw new Error(`The language ${id} was not found.`);
			}
			return grammar;
		};

		entry.evaluatedGrammar = grammar({
			getLanguage: required,
			getOptionalLanguage: (id) => this.getLanguage(id),
			extend: (id, ref) => extend(required(id), id, ref),
		});

		return entry.evaluatedGrammar;
	}
}
