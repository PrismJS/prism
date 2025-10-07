import { kebabToCamelCase } from '../shared/util.js';
import { cloneGrammar } from '../util/extend.js';
import { forEach, toArray } from '../util/iterables.js';
import { extend } from '../util/language-util.js';
import { defineLazyProperty } from '../util/objects.js';

/**
 * TODO: docs
 */
export class Registry {
	/**
	 * A private map from the aliases of components to the id of the component with that alias.
	 *
	 * @type {Map<string, string>}
	 */
	aliasMap = new Map();

	/**
	 * A private map from the aliases of components to the id of the component with that alias.
	 *
	 * @type {Map<string, Entry>}
	 */
	entries = new Map();

	/**
	 * A private reference to the Prism instance.
	 *
	 * @type {Prism}
	 */
	Prism;

	/**
	 * @param {Prism} Prism
	 */
	constructor (Prism) {
		this.Prism = Prism;
	}

	/**
	 * If the given name is a known alias, then the id of the component of the alias will be returned. Otherwise, the
	 * `name` will be returned as is.
	 *
	 * @param {string} name
	 * @returns {string}
	 */
	resolveAlias (name) {
		return this.aliasMap.get(name) ?? name;
	}

	/**
	 * Returns whether this registry has a component with the given name or alias.
	 *
	 * @param {string} name
	 * @returns {boolean}
	 */
	has (name) {
		return this.entries.has(this.resolveAlias(name));
	}

	/**
	 * @param {...ComponentProto} components
	 */
	add (...components) {
		/** @type {Set<string>} */
		const added = new Set();

		/**
		 * @param {ComponentProto} proto
		 */
		const register = proto => {
			const { id } = proto;
			if (this.entries.has(id)) {
				return;
			}

			this.entries.set(id, { proto });
			added.add(id);

			// add aliases
			// @ts-ignore - alias is always there
			forEach(proto.alias, alias => this.aliasMap.set(alias, id));

			// @ts-ignore
			const required = [...toArray(proto.require)]; // don't mutate the original array

			// @ts-ignore
			if (proto.base) {
				// @ts-ignore
				required.unshift(proto.base);
			}

			// dependencies
			// @ts-ignore
			forEach(required, register);

			// add plugin namespace
			if (proto.plugin) {
				this.Prism.plugins[kebabToCamelCase(id)] = proto.plugin(this.Prism);
			}
		};
		components.forEach(register);

		this.update(added);
	}

	/**
	 * Private method to update the registry.
	 *
	 * @param {Set<string>} changed
	 */
	update (changed) {
		/** @type {Map<string, boolean>} */
		const updateCache = new Map();

		/** @type {string[]} */
		const idStack = [];

		/**
		 * @param {string} id
		 * @returns {boolean}
		 */
		const performUpdateUncached = id => {
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
			entry.evaluatedEffect = entry.proto.effect?.(this.Prism);

			return true;
		};

		/**
		 * @param {string} id
		 * @returns {boolean}
		 */
		const performUpdate = id => {
			let status = updateCache.get(id);
			if (status === undefined) {
				idStack.push(id);
				status = performUpdateUncached(id);
				idStack.pop();
				updateCache.set(id, status);
			}
			return status;
		};

		/**
		 * @param {ComponentProto} proto
		 * @returns {boolean}
		 */
		const shouldRunEffects = proto => {
			let depsChanged = false;

			forEach(/** @type {any}*/ (proto.require), ({ id }) => {
				if (performUpdate(id)) {
					depsChanged = true;
				}
			});
			forEach(/** @type {any}*/ (proto.optional), id => {
				if (performUpdate(this.resolveAlias(id))) {
					depsChanged = true;
				}
			});

			return depsChanged || changed.has(proto.id);
		};

		this.entries.forEach((_, id) => performUpdate(id));
	}

	/**
	 * @param {string} id
	 * @returns {Grammar | undefined}
	 */
	getLanguage (id) {
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

		/**
		 * @param {string} id
		 * @returns {Grammar}
		 */
		const required = id => {
			const grammar = this.getLanguage(id);
			if (!grammar) {
				throw new Error(`The language ${id} was not found.`);
			}
			return grammar;
		};

		const base = entry?.proto.base;
		// We need this so that any code modifying the base grammar doesn't affect other instances
		const baseGrammar = base && cloneGrammar(required(base.id), base.id);

		const requiredLanguages = toArray(
			/** @type {LanguageProto | LanguageProto[] | undefined} */ (entry?.proto.require)
		);
		const languages = /** @type {Record<string, Grammar>} */ ({});
		for (const lang of requiredLanguages) {
			defineLazyProperty(languages, lang.id, () => required(lang.id));
		}

		/** @type {Grammar} */
		let evaluatedGrammar;
		if (typeof grammar === 'object') {
			// if the grammar is an object, we can use it directly
			evaluatedGrammar = grammar;
		}
		else {
			const options = {
				getOptionalLanguage: id => this.getLanguage(id),
				extend: (id, ref) => extend(required(id), id, ref),
				...(baseGrammar && { base: baseGrammar }),
				...(requiredLanguages.length && { languages }),
			};

			evaluatedGrammar = grammar(/** @type {any} */ (options));
		}

		if (baseGrammar) {
			evaluatedGrammar = extend(baseGrammar, base.id, evaluatedGrammar);
		}

		return (entry.evaluatedGrammar = evaluatedGrammar);
	}
}

/**
 * @typedef {object} Entry
 * @property {ComponentProto} proto
 * @property {Grammar} [evaluatedGrammar]
 * @property {function(): void} [evaluatedEffect]
 */

/**
 * @typedef {import('../types.d.ts').ComponentProto} ComponentProto
 * @typedef {import('../types.d.ts').LanguageProto} LanguageProto
 * @typedef {import('../types.d.ts').Grammar} Grammar
 * @typedef {import('./prism.js').Prism} Prism
 */
