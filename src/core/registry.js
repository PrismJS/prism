import { forEach } from '../shared/util';

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
	constructor() {
		/**
		 * A map from the aliases of components to the id of the component with that alias.
		 *
		 * @type {Map<string, string>}
		 */
		this.aliasMap = new Map();
		/**
		 * A map from the aliases of components to the id of the component with that alias.
		 *
		 * @type {Map<string, Entry>}
		 */
		this.entries = new Map();
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
	 * @param {import('../types').ComponentProto[]} components
	 */
	add(...components) {
		for (const proto of components) {
			const { id } = proto;

			if (this.entries.has(id)) {
				continue;
			}

			this.entries.set(id, { proto });

			// add aliases
			forEach(proto.alias, alias => this.aliasMap.set(alias, id));

			// dependencies

		}
	}

	/**
	 * @param {string} id
	 * @returns {import("../types").Grammar | undefined}
	 */
	getLanguage(id) {
		// TODO:
		return undefined;
	}
}
