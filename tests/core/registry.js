import { assert } from 'chai';
import { Prism } from '../../src/core/prism';

describe('Registry', () => {
	it('should resolve aliases', () => {
		const { components } = new Prism();

		const grammar = {};
		components.add({ id: 'a', alias: 'b', grammar });

		assert.isTrue(components.has('a'));
		assert.isTrue(components.has('b'));

		assert.strictEqual(components.resolveAlias('a'), 'a');
		assert.strictEqual(components.resolveAlias('b'), 'a');

		assert.strictEqual(components.getLanguage('a'), grammar);
		assert.strictEqual(components.getLanguage('b'), grammar);
	});

	it('should resolve aliases in optional dependencies', () => {
		const { components } = new Prism();

		const grammar = {};
		components.add({ id: 'a', alias: 'b', grammar });
		components.add({
			id: 'c',
			optional: 'b',
			grammar({ getOptionalLanguage }) {
				return getOptionalLanguage('b') ?? {};
			}
		});

		assert.strictEqual(components.getLanguage('c'), grammar);
	});

	it('should throw on circular dependencies', () => {
		assert.throws(() => {
			const { components } = new Prism();

			components.add({ id: 'a', optional: 'b', grammar: {} });
			components.add({ id: 'b', optional: 'a', grammar: {} });
		}, /Circular dependency a -> b -> a not allowed/);

		assert.throws(() => {
			const { components } = new Prism();

			components.add(
				{ id: 'a', optional: 'b', grammar: {} },
				{ id: 'b', optional: 'a', grammar: {} }
			);
		}, /Circular dependency a -> b -> a not allowed/);

		assert.throws(() => {
			const { components } = new Prism();

			components.add({ id: 'a', optional: 'a', grammar: {} });
		}, /Circular dependency a -> a not allowed/);
	});
});
