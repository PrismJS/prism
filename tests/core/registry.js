import { assert } from 'chai';
import { Prism } from '../../src/core/prism.js';

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
 * @import { Grammar, GrammarOptions } from '../../src/types.d.ts';
 */
