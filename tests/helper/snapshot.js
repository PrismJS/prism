const chai = require('chai');
const { jestSnapshotPlugin } = require('mocha-chai-jest-snapshot');


chai.use(jestSnapshotPlugin());

const UseSnapshot = Symbol();

/**
 * @param {T} actual
 * @param {T | typeof UseSnapshot} expected
 * @template T
 */
function assertEqual(actual, expected) {
	if (expected == UseSnapshot) {
		chai.expect(actual).toMatchSnapshot();
	} else {
		chai.assert.strictEqual(actual, expected);
	}
}

module.exports = { UseSnapshot, assertEqual };
