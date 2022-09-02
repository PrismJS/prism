import { assert, expect, use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';


use(jestSnapshotPlugin());

export const useSnapshot = Symbol();

/**
 * @param {T} actual
 * @param {T | useSnapshot} expected
 * @template T
 */
export function assertEqual(actual, expected) {
	if (expected === useSnapshot) {
		expect(actual).toMatchSnapshot();
	} else {
		assert.strictEqual(actual, expected);
	}
}
