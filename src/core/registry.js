import { extend } from '../shared/language-util';
import { forEach, kebabToCamelCase } from '../shared/util';

/**
 * @typedef Entry
 * @property {import('../types').ComponentProto} proto
 * @property {import('../types').Grammar} [evaluatedGrammar]
 * @property {() => void} [evaluatedEffect]
 */

/**
 * TODO: docs
 */
export class Registry {
	/**
	 * A map from the aliases of components to the id of the component with that alias.
	 *
	 * @type {Map<string, string>}
	 * @private
	 */
	aliasMap = new Map();

	/**
	 * A map from the aliases of components to the id of the component with that alias.
	 *
	 * @type {Map<string, Entry>}
	 * @private
	 */
	entries = new Map();

	/**
	 * @param {import('./prism').Prism} Prism
	 */
	constructor(Prism) {
		/**
		 * @private
		 */
		this.Prism = Prism;
	}

	/**
	 * If the given name is a known alias, then the id of the component of the alias will be returned. Otherwise, the
	 * `name` will be returned as is.
	 *
	 * @param {string} name
	 * @returns {string}
	 */
	resolveAlias(name) {
		return this.aliasMap.get(name) ?? name;
	}

	/**
	 * Returns whether this registry has a component with the given name or alias.
	 *
	 * @param {string} name
	 * @returns {boolean}
	 */
	has(name) {
		return this.entries.has(this.resolveAlias(name));
	}

	/**
	 * @param {import('../types').ComponentProto[]} components
	 */
	add(...components) {
		/** @type {Set<string>} */
		const added = new Set();

		/**
		 * @param {import('../types').ComponentProto} proto
		 */
		const register = (proto) => {
			const { id } = proto;
			if (this.entries.has(id)) {
				return;
			}

			this.entries.set(id, { proto });
			added.add(id);

			// add aliases
			forEach(proto.alias, alias => this.aliasMap.set(alias, id));

			// dependencies
			forEach(proto.require, register);

			// add plugin namespace
			if ('plugin' in proto && proto.plugin) {
				this.Prism.plugins[kebabToCamelCase(id)] = proto.plugin(/** @type {any} */ (this.Prism));
			}
		};
		components.forEach(register);

		this.update(added);
	}

	/**
	 * @param {ReadonlySet<string>} changed
	 * @returns {void}
	 * @private
	 */
	update(changed) {
		/** @type {Map<string, boolean>} */
		const updateStatus = new Map();

		/** @type {string[]} */
		const idStack = [];

		/**
		 * @param {string} id
		 * @returns {boolean}
		 */
		const didUpdate = (id) => {
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
				entry.evaluatedEffect = entry.proto.effect(/** @type {any} */ (this.Prism));
			}

			updateStatus.set(id, status = true);
			return status;
		};
		/**
		 * @param {import('../types').ComponentProto} proto
		 * @returns {boolean}
		 */
		const shouldRunEffects = (proto) => {
			/** @type {boolean} */
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

	/**
	 * @param {string} id
	 * @returns {import("../types").Grammar | undefined}
	 */
	getLanguage(id) {
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

		if (typeof entry.proto.grammar === 'object') {
			// This is an optimization.
			// If a grammar is given as an object, then it may depend on other languages by referencing them by id
			// (using `inside` or `rest`), but we can evaluate those grammars later if needed.
			entry.evaluatedGrammar = entry.proto.grammar;
			return entry.evaluatedGrammar;
		}

		// handle dependencies
		forEach(entry.proto.require, proto => this.getLanguage(proto.id));
		forEach(entry.proto.optional, id => this.getLanguage(id));

		/**
		 * @param {string} id
		 */
		const required = (id) => {
			const grammar = this.getLanguage(id);
			if (!grammar) {
				throw new Error(`The language ${id} was not found.`);
			}
			return grammar;
		};

		entry.evaluatedGrammar = entry.proto.grammar({
			getLanguage: required,
			getOptionalLanguage: id => this.getLanguage(id),
			extend: (id, ref) => extend(required(id), id, ref),
		});

		return entry.evaluatedGrammar;
	}
}
