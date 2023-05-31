import { assert, expect, use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';


use(jestSnapshotPlugin());

export const useSnapshot = Symbol();

export function assertEqual<T>(actual: T, expected: T | typeof useSnapshot) {
	if (expected === useSnapshot) {
		expect(actual).toMatchSnapshot();
	} else {
		assert.strictEqual(actual, expected);
	}
}
