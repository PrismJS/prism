const { assert } = require('chai');
const getLoad = require('../dependencies');
const components = require('../components');


describe('Dependency logic', function () {

	/** @type {import("../dependencies").Components} */
	const components = {
		languages: {
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

		it('- should throw on unknown dependencies', function () {
			assert.throws(() => {
				/** @type {import("../dependencies").Components} */
				const circular = {
					languages: {
						a: {
							require: 'c'
						},
						b: "B"
					}
				};
				getLoad(circular, ['a']).getIds();
			});
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

		it('- should throw on duplicate aliases', function () {
			assert.throws(() => {
				/** @type {import("../dependencies").Components} */
				const circular = {
					languages: {
						a: {
							alias: 'c'
						},
						b: {
							alias: 'c'
						}
					}
				};
				getLoad(circular, ['a']).getIds();
			});
		});

		it('- should throw on aliases which are components', function () {
			assert.throws(() => {
				/** @type {import("../dependencies").Components} */
				const circular = {
					languages: {
						a: {
							alias: 'b'
						},
						b: "B"
					}
				};
				getLoad(circular, ['a']).getIds();
			});
		});

	});

	describe('Circular dependencies', function () {

		it('- should throw on circular dependencies', function () {
			assert.throws(() => {
				/** @type {import("../dependencies").Components} */
				const circular = {
					languages: {
						a: {
							require: 'b'
						},
						b: {
							after: 'a'
						}
					}
				};
				getLoad(circular, ['a']).getIds();
			});
		});

	});

});

describe('components.json', function () {

	it('- should be valid', function () {
		try {
			getLoad(components, Object.keys(components.languages).filter(k => k != 'meta')).getIds();
		} catch (error) {
			assert.fail(error.toString());
		}
	});

});
