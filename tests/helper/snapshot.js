import { assert, expect, use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';

use(jestSnapshotPlugin());

export const useSnapshot = Symbol();

/**
 * @template T
 * @param {T} actual
 * @param {T | symbol} expected
 */
export function assertEqual (actual, expected) {
	if (expected === useSnapshot) {
		expect(actual).toMatchSnapshot();
	}
	else {
		assert.strictEqual(actual, expected);
	}
}
