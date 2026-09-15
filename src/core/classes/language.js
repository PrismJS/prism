import { extend } from '../../shared.js';
import { grammarPatch } from '../../util/grammar-patch.js';
import { deepClone, defineLazyProperty } from '../../util/objects.js';
import List from './list.js';

export default class Language extends EventTarget {
	/** @type {LanguageProto} */
	def;

	/** @type {LanguageRegistry} */
	registry;

	/**
	 * The id of this language. For derived meta-language instances this is the
	 * compound id (e.g. `diff:css`), otherwise it is the id of the definition.
	 *
	 * @type {string}
	 */
	id;

	/** @type {List<Language | LanguageProto>} */
	require = new List();

	/** @type {List<string | Language | LanguageProto>} */
	optional = new List();

	/** @type {LanguageGrammars} */
	languages = {};

	readyState = 0;

	/**
	 * The inner language of this meta-language instance, `null` if there is none.
	 * `undefined` means it has not been resolved yet.
	 *
	 * @type {Language | null | undefined}
	 */
	#inner;

	/**
	 *
	 * @param {LanguageProto} def
	 * @param {LanguageRegistry} registry
	 * @param {LanguageOptions} [options]
	 */
	constructor (def, registry, options = {}) {
		super();
		this.def = def;
		this.registry = registry;
		this.id = options.id ?? def.id;
		this.#inner = options.inner;

		if (this.def.base) {
			this.require.add(this.def.base);
		}
		if (this.def.require) {
			this.require.addAll(/** @type {LanguageProto | LanguageProto[]} */ (this.def.require));
		}
		if (this.def.inner) {
			// The default inner language is a hard dependency, just like `base`
			this.registry.add(this.def.inner);
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
	 * The inner language this instance embeds or produces, or `null` if there is none.
	 *
	 * Only meta-languages (definitions with an `inner` key) can have an inner language.
	 * Unless one was explicitly provided (e.g. for `diff:css`), the default inner language
	 * declared by the definition is used.
	 *
	 * @returns {Language | null}
	 */
	get inner () {
		let inner = this.#inner;
		if (inner === undefined) {
			const def = this.def.inner;
			inner = def ? this.registry.getLanguage(def) : null;
			this.#inner = inner;
		}

		return /** @type {Language | null} */ (inner);
	}

	/**
	 * @returns {Grammar}
	 */
	get grammar () {
		// Lazily evaluate grammar
		const def = this.def;

		let { grammar } = def;
		const base = this.base;
		const inner = this.inner;
		let innerUsed = false;

		if (typeof grammar === 'function') {
			const options = {
				...(base && {
					get base () {
						return base.resolvedGrammar;
					},
				}),
				languages: this.languages,

				get inner () {
					innerUsed = true;
					return inner?.resolvedGrammar;
				},

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

		if (inner && !innerUsed && (/** @type {Grammar} */ (grammar)).$inner === undefined) {
			// Unless the grammar places the inner language itself, everything that is not a token
			// of this grammar is the inner language.
			grammar = { ...grammar, $inner: () => inner.resolvedGrammar };
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

/**
 * @typedef {object} LanguageOptions
 * @property {string} [id] The id of the language instance. Defaults to the id of the definition.
 * @property {Language | null} [inner] The inner language. `null` means none. If omitted, the
 * default inner language of the definition is used.
 */
