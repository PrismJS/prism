import { assert } from 'chai';
import { Prism } from '../../src/core/prism';
import type { Grammar } from '../../src/types';

describe('Registry', () => {
	it('should resolve aliases', () => {
		const { languageRegistry } = new Prism();

		const grammar = {} as Grammar;
		languageRegistry.add({ id: 'a', alias: 'b', grammar });

		assert.equal(languageRegistry.resolveRef('a').id, 'a');
		assert.equal(languageRegistry.resolveRef('b').id, 'a');

		assert.strictEqual(languageRegistry.aliases['b'], 'a');

		assert.deepStrictEqual(languageRegistry.getLanguage('a')?.resolvedGrammar, grammar);
		assert.deepStrictEqual(languageRegistry.getLanguage('b')?.resolvedGrammar, grammar);
	});

	it('should resolve aliases in optional dependencies', () => {
		const { languageRegistry } = new Prism();

		const grammar = {} as Grammar;
		languageRegistry.add({ id: 'a', alias: 'b', grammar });
		languageRegistry.add({
			id: 'c',
			optional: 'b',
			grammar: ({ getLanguage }) => getLanguage('b') ?? {},
		});

		assert.deepStrictEqual(languageRegistry.getLanguage('c')?.resolvedGrammar, grammar);
	});
});
