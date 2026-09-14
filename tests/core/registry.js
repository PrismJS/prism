import { assert } from 'chai';
import Language from '../../src/core/classes/language.js';
import { Prism } from '../../src/core/prism.js';
import { simplify } from '../helper/token-stream-transformer.js';

describe('Registry', () => {
	it('should resolve aliases', () => {
		const { languageRegistry } = new Prism();

		const grammar = /** @type {Grammar} */ ({ 'keyword': 'foo' });
		languageRegistry.add({ id: 'a', alias: 'b', grammar });

		assert.isTrue(languageRegistry.has('a'));

		assert.strictEqual(languageRegistry.resolveRef('a').id, 'a');
		assert.strictEqual(languageRegistry.resolveRef('b').id, 'a');

		assert.deepStrictEqual(languageRegistry.getLanguage('a')?.resolvedGrammar, grammar);
		assert.deepStrictEqual(languageRegistry.getLanguage('b')?.resolvedGrammar, grammar);
	});

	it('should resolve aliases in optional dependencies', () => {
		const { languageRegistry } = new Prism();

		const grammar = /** @type {Grammar} */ ({ 'keyword': 'foo' });
		languageRegistry.add({ id: 'a', alias: 'b', grammar });
		languageRegistry.add({
			id: 'c',
			optional: 'b',
			/**
			 * @param {GrammarOptions} options
			 */
			grammar ({ getOptionalLanguage }) {
				return getOptionalLanguage('b') ?? { 'keyword': 'bar' };
			},
		});

		assert.deepStrictEqual(languageRegistry.getLanguage('c')?.resolvedGrammar, grammar);
	});

	it.skip('should throw on circular dependencies', () => {
		assert.throws(() => {
			const { languageRegistry } = new Prism();

			languageRegistry.add({ id: 'a', optional: 'b', grammar: {} });
			languageRegistry.add({ id: 'b', optional: 'a', grammar: {} });
		}, /Circular dependency a -> b -> a not allowed/);

		assert.throws(() => {
			const { languageRegistry } = new Prism();

			languageRegistry.add({ id: 'a', optional: 'b', grammar: {} });
			languageRegistry.add({ id: 'b', optional: 'a', grammar: {} });
		}, /Circular dependency a -> b -> a not allowed/);

		assert.throws(() => {
			const { languageRegistry } = new Prism();

			languageRegistry.add({ id: 'a', optional: 'a', grammar: {} });
		}, /Circular dependency a -> a not allowed/);
	});
});

/**
 * @import { Grammar, GrammarOptions, LanguageProto } from '../../src/types.d.ts';
 */

describe('Registry: compound ids (outer:inner)', () => {
	/**
	 * Creates a registry with:
	 * - `host` (alias `h`): a plain language
	 * - `other` (alias `o`): a plain language
	 * - `tpl` (alias `t`): a meta-language defaulting to `host`
	 * - `meta`: a meta-language without a default, whose grammar function records `inner`
	 */
	function createRegistry () {
		const { languageRegistry } = new Prism();

		/** @type {LanguageProto} */
		const host = { id: 'host', alias: 'h', grammar: { 'keyword': /\bhost\b/ } };
		/** @type {LanguageProto} */
		const other = { id: 'other', alias: 'o', grammar: { 'string': /"[^"]*"/ } };
		/** @type {LanguageProto} */
		const tpl = {
			id: 'tpl',
			alias: 't',
			inner: host,
			grammar: { 'tpl': /\{\{[^}]*\}\}/ },
		};
		/** @type {Record<string, Grammar | undefined>} */
		const seenInner = {};
		/** @type {LanguageProto} */
		const meta = {
			id: 'meta',
			inner: null,
			grammar ({ inner }) {
				seenInner[String(Object.keys(seenInner).length)] = inner;
				// line prefixes that leave no placeholder, like `diff`
				return { 'meta': /^!/m, $inner: inner, $placeholder: false };
			},
		};

		for (const def of [host, other, tpl, meta]) {
			languageRegistry.add(def);
		}

		return { languageRegistry, host, other, tpl, meta, seenInner };
	}

	it('should normalize compound ids', () => {
		const { languageRegistry } = createRegistry();

		// inner equal to the default collapses to the plain id
		assert.strictEqual(languageRegistry.resolveRef('tpl:host').id, 'tpl');
		assert.strictEqual(languageRegistry.resolveRef('t:h').id, 'tpl');
		// aliases are resolved per part
		assert.strictEqual(languageRegistry.resolveRef('t:o').id, 'tpl:other');
		// `none` opts out of the default
		assert.strictEqual(languageRegistry.resolveRef('tpl:none').id, 'tpl:none');
		// `none` on a language without a default is the plain language
		assert.strictEqual(languageRegistry.resolveRef('meta:none').id, 'meta');
		// unknown inner languages are kept as-is
		assert.strictEqual(languageRegistry.resolveRef('tpl:missing').id, 'tpl:missing');
		// recursion
		assert.strictEqual(languageRegistry.resolveRef('meta:t:o').id, 'meta:tpl:other');
		assert.strictEqual(languageRegistry.resolveRef('meta:tpl:host').id, 'meta:tpl');
	});

	it('should report whether compound ids can be resolved', () => {
		const { languageRegistry } = createRegistry();

		for (const id of ['tpl', 't', 'tpl:other', 'tpl:o', 'tpl:none', 'tpl:host', 'meta:tpl:other']) {
			assert.isTrue(languageRegistry.has(id), id);
		}
		for (const id of ['tpl:missing', 'other:tpl', 'host:other', 'nope', 'nope:tpl']) {
			assert.isFalse(languageRegistry.has(id), id);
		}
	});

	it('should create derived languages for compound ids', () => {
		const { languageRegistry } = createRegistry();

		const derived = languageRegistry.getLanguage('tpl:other');
		assert.instanceOf(derived, Language);
		assert.strictEqual(derived?.id, 'tpl:other');
		assert.strictEqual(derived?.inner, languageRegistry.getLanguage('other'));

		// cached and alias-aware
		assert.strictEqual(languageRegistry.getLanguage('t:o'), derived);
		assert.strictEqual(languageRegistry.peek('tpl:other'), derived);

		// distinct from the plain language
		const plain = languageRegistry.getLanguage('tpl');
		assert.notStrictEqual(plain, derived);
		assert.strictEqual(plain?.id, 'tpl');
		assert.strictEqual(plain?.inner, languageRegistry.getLanguage('host'));
		assert.strictEqual(languageRegistry.getLanguage('tpl:host'), plain);
		assert.strictEqual(languageRegistry.peek('tpl:other'), derived);

		// no inner language
		assert.strictEqual(languageRegistry.getLanguage('tpl:none')?.inner, null);
		assert.strictEqual(languageRegistry.getLanguage('meta')?.inner, null);

		// derived languages never show up as definitions
		assert.deepStrictEqual(Object.keys(languageRegistry.cache).sort(), ['host', 'meta', 'other', 'tpl']);
	});

	it('should not resolve compound ids of non-meta-languages or unknown inner languages', () => {
		const { languageRegistry } = createRegistry();

		assert.isNull(languageRegistry.getLanguage('other:tpl'));
		assert.isNull(languageRegistry.getLanguage('host:other'));
		assert.isNull(languageRegistry.getLanguage('tpl:missing'));
		assert.isNull(languageRegistry.getLanguage('nope:tpl'));

		languageRegistry.add({ id: 'missing', grammar: {} });
		assert.isNotNull(languageRegistry.getLanguage('tpl:missing'));
	});

	it('should compose the inner language via templating by default', () => {
		const { languageRegistry, tpl } = createRegistry();

		const withDefault = languageRegistry.getLanguage('tpl')?.resolvedGrammar;
		const withOther = languageRegistry.getLanguage('tpl:other')?.resolvedGrammar;
		const withNone = languageRegistry.getLanguage('tpl:none')?.resolvedGrammar;

		assert.isFunction(withDefault?.$inner);
		assert.isFunction(withOther?.$inner);
		assert.isUndefined(withNone?.$inner);

		// the definition itself is untouched
		assert.isUndefined(/** @type {Grammar} */ (tpl.grammar).$inner);

		const prism = languageRegistry.prism;
		const code = 'host {{ x }} "42"';

		assert.deepStrictEqual(simplify(prism.tokenize(code, /** @type {Grammar} */ (withDefault))), [
			['keyword', 'host'],
			['tpl', '{{ x }}'],
			' "42"',
		]);
		assert.deepStrictEqual(simplify(prism.tokenize(code, /** @type {Grammar} */ (withOther))), [
			'host ',
			['tpl', '{{ x }}'],
			['string', '"42"'],
		]);
		assert.deepStrictEqual(simplify(prism.tokenize(code, /** @type {Grammar} */ (withNone))), [
			'host ',
			['tpl', '{{ x }}'],
			' "42"',
		]);
	});

	it('should pass the inner grammar to grammar functions', () => {
		const { languageRegistry, seenInner } = createRegistry();

		languageRegistry.getLanguage('meta')?.resolvedGrammar;
		assert.isUndefined(seenInner['0']);

		languageRegistry.getLanguage('meta:other')?.resolvedGrammar;
		assert.strictEqual(seenInner['1'], languageRegistry.getLanguage('other')?.resolvedGrammar);

		// recursion: the inner language may itself be a compound language
		const nested = languageRegistry.getLanguage('meta:t:o');
		assert.strictEqual(nested?.id, 'meta:tpl:other');
		assert.strictEqual(nested?.inner?.id, 'tpl:other');
		nested?.resolvedGrammar;
		assert.strictEqual(seenInner['2'], languageRegistry.getLanguage('tpl:other')?.resolvedGrammar);
	});
});

describe('Registry: $placeholder', () => {
	it('should take tokens out without a placeholder when $placeholder is false', () => {
		const { languageRegistry } = new Prism();
		languageRegistry.add({ id: 'host', grammar: { 'keyword': /\bhost\b/ } });
		languageRegistry.add({
			id: 'meta',
			inner: null,
			grammar ({ inner }) {
				return { 'meta': /^!/m, $inner: inner, $placeholder: false };
			},
		});

		const prism = languageRegistry.prism;
		const grammar = /** @type {Grammar} */ (languageRegistry.getLanguage('meta:host')?.resolvedGrammar);

		// a placeholder would glue to `host` and prevent the keyword from matching
		assert.deepStrictEqual(simplify(prism.tokenize('!host\n!host', grammar)), [
			['meta', '!'],
			['keyword', 'host'],
			['meta', '!'],
			['keyword', 'host'],
		]);
	});
});
