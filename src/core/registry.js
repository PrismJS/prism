import { extend } from '../shared/language-util';
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
