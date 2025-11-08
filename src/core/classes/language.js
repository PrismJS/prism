import { extend } from '../../shared.js';
import { grammarPatch } from '../../util/grammar-patch.js';
import { deepClone, defineLazyProperty } from '../../util/objects.js';
import List from './list.js';

export default class Language extends EventTarget {
	/** @type {LanguageProto} */
	def;

	/** @type {LanguageRegistry} */
	registry;

	/** @type {List<Language | LanguageProto>} */
	require = new List();

	/** @type {List<string | Language | LanguageProto>} */
	optional = new List();

	/** @type {LanguageGrammars} */
	languages = {};

	readyState = 0;

	/**
	 *
	 * @param {LanguageProto} def
	 * @param {LanguageRegistry} registry
	 */
	constructor (def, registry) {
		super();
		this.def = def;
		this.registry = registry;

		if (this.def.base) {
			this.require.add(this.def.base);
		}
		if (this.def.require) {
			this.require.addAll(/** @type {LanguageProto | LanguageProto[]} */ (this.def.require));
		}

		if (this.def.optional) {
			this.optional.addAll(this.def.optional);

			if (this.optional.size > 0) {
				for (const optionalLanguageId of this.optional) {
					if (!this.registry.has(optionalLanguageId)) {
						this.registry.whenDefined(optionalLanguageId).then(() => {
							// TODO
						});
					}
				}
			}
		}

		for (const def of this.require) {
			// Ensure all required languages are registered, but not necessarily resolved yet
			this.registry.add(def);

			defineLazyProperty(this.languages, def.id, () => {
				const language = this.registry.peek(def);
				if (language) {
					// Already resolved
					return language.resolvedGrammar;
				}
				else {
					return this.registry.getLanguage(def.id).resolvedGrammar;
				}
			});
		}

		for (const id of this.optional) {
			// TODO: we need to update the grammar
			defineLazyProperty(
				this.languages,
				id,
				() => {
					return this.registry.getLanguage(id).resolvedGrammar;
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

	/**
	 * @returns {Language | null}
	 */
	get base () {
		if (!this.def.base) {
			return null;
		}

		const base = this.def.base;
		const language = this.registry.peek(base);
		if (language) {
			// Already resolved
			return language;
		}
		else {
			return this.registry.getLanguage(base.id);
		}
	}

	/**
	 * @returns {Grammar}
	 */
	get grammar () {
		// Lazily evaluate grammar
		const def = this.def;

		let { grammar } = def;
		const base = this.base;

		if (typeof grammar === 'function') {
			const options = {
				...(base && {
					get base () {
						return base.resolvedGrammar;
					},
				}),
				languages: this.languages,

				/**
				 * @param {string} id
				 * @param {Grammar} ref
				 */
				extend: (id, ref) => extend(this.languages[id], ref),

				/**
				 * @param {string} id
				 */
				getOptionalLanguage: id => {
					const language = this.languages[id] ?? this.registry.getLanguage(id);
					return language?.resolvedGrammar ?? language;
				},

				/**
				 * @param {string} id
				 */
				whenDefined: id => {
					return this.registry.whenDefined(id);
				},
			};
			grammar = grammar.call(this, /** @type {any} */ (options));
		}

		if (base) {
			grammar = extend(base.grammar, grammar);
		}

		if (def.grammar === grammar) {
			// We need these to be separate so that any code modifying them doesn't affect other instances
			grammar = deepClone(grammar);
		}

		// This will replace the getter with a writable property
		// @ts-ignore
		return (this.grammar = grammar);
	}

	/**
	 * @param {Grammar} grammar
	 */
	set grammar (grammar) {
		this.readyState = 2;
		Object.defineProperty(this, 'grammar', { value: grammar, writable: true });
	}

	get resolvedGrammar () {
		const ret = grammarPatch(this.grammar);
		return (this.resolvedGrammar = ret);
	}

	/**
	 * @param {Grammar} grammar
	 */
	set resolvedGrammar (grammar) {
		this.readyState = 3;
		Object.defineProperty(this, 'resolvedGrammar', { value: grammar, writable: true });
	}
}

/** @import { LanguageGrammars, LanguageProto, LanguageRegistry, Grammar } from '../../types.d.ts' */
