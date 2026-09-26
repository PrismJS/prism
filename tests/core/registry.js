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
 * @import { Grammar, GrammarOptions, InnerSpec, LanguageProto } from '../../src/types.d.ts';
 */

describe('Registry: compound ids (outer:inner)', () => {
	/**
	 * Creates a registry with:
	 * - `host` (alias `h`): a plain language
	 * - `other` (alias `o`): a plain language
	 * - `tpl` (alias `t`): a meta-language defaulting to `host`
	 * - `meta`: a meta-language without a default that selects its own containers, like `diff`
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
		/** @type {LanguageProto} */
		const meta = {
			id: 'meta',
			inner: null,
			// lines with a prefix, like `diff`: the inner language is what follows the prefixes
			grammar: {
				'line': {
					pattern: /^!.*(?:\n|$)/m,
					inside: { 'prefix': /^!/ },
				},
				$inner: { select: 'line' },
			},
		};

		for (const def of [host, other, tpl, meta]) {
			languageRegistry.add(def);
		}

		return { languageRegistry, host, other, tpl, meta };
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

	it('should fill in the inner language of a `$inner` selection', () => {
		const { languageRegistry, meta } = createRegistry();

		const plain = /** @type {Grammar} */ (languageRegistry.getLanguage('meta')?.resolvedGrammar);
		const withHost = /** @type {Grammar} */ (languageRegistry.getLanguage('meta:host')?.resolvedGrammar);

		// no inner language: the selection is left alone
		assert.deepStrictEqual(plain.$inner, { select: 'line' });
		// the definition itself is untouched
		assert.deepStrictEqual(/** @type {Grammar} */ (meta.grammar).$inner, { select: 'line' });
		// the instance's inner language is filled in
		assert.isFunction(/** @type {InnerSpec} */ (withHost.$inner).language);
		assert.strictEqual(/** @type {InnerSpec} */ (withHost.$inner).select, 'line');

		// recursion: the inner language may itself be a compound language
		const nested = languageRegistry.getLanguage('meta:t:o');
		assert.strictEqual(nested?.id, 'meta:tpl:other');
		assert.strictEqual(nested?.inner?.id, 'tpl:other');
	});

	it('should leave a `$inner` language the grammar chose itself alone', () => {
		const { languageRegistry } = createRegistry();
		languageRegistry.add({
			id: 'fixed',
			inner: null,
			grammar: { 'line': { pattern: /^!.*(?:\n|$)/m }, $inner: { language: 'other', select: 'line' } },
		});

		const grammar = /** @type {Grammar} */ (languageRegistry.getLanguage('fixed:host')?.resolvedGrammar);

		// the instance's inner language (`host`) fills a gap, it does not overrule a stated language
		assert.strictEqual(/** @type {InnerSpec} */ (grammar.$inner).language, 'other');
	});
});

describe('Registry: $inner selectors', () => {
	const host = /** @type {LanguageProto} */ ({ id: 'host', grammar: { 'keyword': /\bhost\b/ } });

	it('should highlight the selected containers as one whole, without the other tokens', () => {
		const { languageRegistry } = new Prism();
		languageRegistry.add(host);
		languageRegistry.add({
			id: 'meta',
			inner: null,
			grammar: {
				'line': { pattern: /^!.*(?:\n|$)/m, inside: { 'prefix': /^!/ } },
				$inner: { select: 'line' },
			},
		});

		const prism = languageRegistry.prism;
		const grammar = /** @type {Grammar} */ (languageRegistry.getLanguage('meta:host')?.resolvedGrammar);

		// the prefixes are not part of the inner code, so `host` is a keyword right after them
		assert.deepStrictEqual(simplify(prism.tokenize('!host\n!host', grammar)), [
			['line', [['prefix', '!'], ['keyword', 'host']]],
			['line', [['prefix', '!'], ['keyword', 'host']]],
		]);
	});

	it('should take the inner language from the selection', () => {
		const { languageRegistry } = new Prism();
		languageRegistry.add(host);
		// no `select`: the default `:text` selection with an explicit language
		languageRegistry.add({ id: 'meta', grammar: { 'tag': /\{\{[^}]*\}\}/, $inner: { language: 'host' } } });

		const prism = languageRegistry.prism;
		const grammar = /** @type {Grammar} */ (languageRegistry.getLanguage('meta')?.resolvedGrammar);

		assert.deepStrictEqual(simplify(prism.tokenize('host {{x}}', grammar)), [
			['keyword', 'host'],
			['tag', '{{x}}'],
		]);
	});

	it('should reject a selection that names no container', () => {
		// a typo is silent (no container of that name is found in the code), but naming nothing at
		// all can only be a mistake, and would leave the inner language unused without a word
		// with and without an inner language: the grammar is malformed either way
		for (const inner of [host, null]) {
			for (const select of ['', ' , ', []]) {
				// a registry per case: `add` ignores an id it already has
				const { languageRegistry } = new Prism();
				languageRegistry.add(host);
				languageRegistry.add({ id: 'meta', inner, grammar: { 'tag': /\{\{[^}]*\}\}/, $inner: { select } } });
				const grammar = /** @type {Grammar} */ (languageRegistry.getLanguage('meta')?.resolvedGrammar);

				assert.throws(() => languageRegistry.prism.tokenize('host', grammar), Error, /\$inner/,
					JSON.stringify({ inner: inner?.id ?? null, select }));
			}
		}
	});

	it('should combine token containers with the unmatched text', () => {
		const { languageRegistry } = new Prism();
		languageRegistry.add(host);
		languageRegistry.add({
			id: 'meta',
			inner: host,
			grammar: {
				'group': { pattern: /\[[^\]]*\]/, inside: { 'punctuation': /[[\]]/ } },
				'other': { pattern: /\([^)]*\)/, inside: { 'punctuation': /[()]/ } },
				$inner: { select: 'group, :text' },
			},
		});

		const prism = languageRegistry.prism;
		const grammar = /** @type {Grammar} */ (languageRegistry.getLanguage('meta')?.resolvedGrammar);

		assert.deepStrictEqual(simplify(prism.tokenize('host [host] (host)', grammar)), [
			['keyword', 'host'],
			['group', [['punctuation', '['], ['keyword', 'host'], ['punctuation', ']']]],
			['other', [['punctuation', '('], 'host', ['punctuation', ')']]],
		]);
	});

	it('should highlight each selector separately, later ones winning', () => {
		const { languageRegistry } = new Prism();
		languageRegistry.add(host);
		languageRegistry.add({ id: 'shout', grammar: { 'shout': /\bhost\b/ } });
		languageRegistry.add({
			id: 'meta',
			inner: null,
			grammar: {
				'a': { pattern: /\[[^\]]*\]/, inside: { 'punctuation': /[[\]]/ } },
				'b': { pattern: /\([^)]*\)/, inside: { 'punctuation': /[()]/ } },
				// like a diff: `a` and `b` are two versions of the code around the shared text
				$inner: { select: ['a, :text', 'b, :text'] },
			},
		});

		const prism = languageRegistry.prism;

		// with `host` as the inner language both documents produce the same tokens
		assert.deepStrictEqual(
			simplify(prism.tokenize('host [host] (host)', /** @type {Grammar} */ (languageRegistry.getLanguage('meta:host')?.resolvedGrammar))),
			[
				['keyword', 'host'],
				['a', [['punctuation', '['], ['keyword', 'host'], ['punctuation', ']']]],
				['b', [['punctuation', '('], ['keyword', 'host'], ['punctuation', ')']]],
			]
		);

		// a multi-line construct spanning the shared text and one version is highlighted as one whole
		languageRegistry.add({
			id: 'quoted',
			grammar: { 'string': /"[^"]*"/ },
		});
		assert.deepStrictEqual(
			simplify(prism.tokenize('"x [y"] (z)', /** @type {Grammar} */ (languageRegistry.getLanguage('meta:quoted')?.resolvedGrammar))),
			[
				// the shared text takes the tokens of the last selector, where the quote is unterminated
				'"x ',
				['a', [['punctuation', '['], ['string', 'y"'], ['punctuation', ']']]],
				['b', [['punctuation', '('], 'z', ['punctuation', ')']]],
			]
		);
	});
});
