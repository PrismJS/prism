const { assert } = require('chai');
const getLoad = require('../dependencies');


describe('Dependency logic', function () {

	/** @type {import("../dependencies").Components} */
	const components = {
		languages: {
			meta: {},
			'a': {
				alias: 'a2'
			},
			'b': {
				alias: 'b2'
			},
			'c': {
				require: 'a',
				after: ['b', 'e']
			},
			'd': {
				require: ['c', 'b'],
				alias: 'xyz'
			},
		},
		pluginsOrSomething: {
			meta: {},
			'e': {
				modify: 'a'
			},
		}
	};

	/**
	 * Returns the ids of `getLoad`.
	 *
	 * @param {string[]} load
	 * @param {string[]} [loaded]
	 * @returns {string[]}
	 */
	function getIds(load, loaded) {
		return getLoad(components, load, loaded).getIds();
	}

	describe('Returned ids', function () {

		it('- should load requirements', function () {
			assert.sameMembers(getIds(['d']), ['a', 'b', 'c', 'd']);
		});

		it('- should not load already loaded requirements if not necessary', function () {
			assert.sameMembers(getIds(['d'], ['a', 'b']), ['c', 'd']);
		});

		it('- should load already loaded requirements if requested', function () {
			assert.sameMembers(getIds(['a', 'd'], ['a', 'b']), ['a', 'c', 'd']);
		});

		it('- should reload modified components', function () {
			assert.sameMembers(getIds(['e'], ['a', 'b', 'c', 'd']), ['a', 'c', 'd', 'e']);
		});

		it('- should work with empty load', function () {
			assert.sameMembers(getIds([], ['a', 'b', 'c', 'd']), []);
		});

		it('- should return unknown ids as is', function () {
			assert.sameMembers(getIds(['c', 'foo'], ['bar']), ['foo', 'c', 'a']);
		});

	});

	describe('Load order', function () {

		// Note: The order of a and b isn't defined, so don't add any test with both of them being loaded here

		it('- should load components in the correct order (require)', function () {
			assert.deepStrictEqual(getIds(['c']), ['a', 'c']);
		});

		it('- should load components in the correct order (modify)', function () {
			assert.deepStrictEqual(getIds(['e', 'a']), ['a', 'e']);
		});

		it('- should load components in the correct order (after)', function () {
			assert.deepStrictEqual(getIds(['c', 'b'], ['a']), ['b', 'c']);
		});

		it('- should load components in the correct order (require + after)', function () {
			assert.deepStrictEqual(getIds(['d'], ['a']), ['b', 'c', 'd']);
		});

		it('- should load components in the correct order (require + modify + after)', function () {
			assert.deepStrictEqual(getIds(['d', 'e'], ['b']), ['a', 'e', 'c', 'd']);
		});

	});

	describe('Aliases', function () {

		it('- should resolve aliases in the list of components to load', function () {
			assert.sameMembers(getIds(['xyz']), ['a', 'b', 'c', 'd']);
		});

		it('- should resolve aliases in the list of loaded components', function () {
			assert.sameMembers(getIds(['d'], ['a', 'a2', 'b2']), ['c', 'd']);
		});

	});

});
