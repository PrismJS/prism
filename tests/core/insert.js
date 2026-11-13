import { assert } from 'chai';
import { insert, insertAfter, insertBefore } from '../../src/util/insert.js';

describe('insert/insertBefore/insertAfter', () => {
	/*
	 * `toString`, `constructor` and `hasOwnProperty` are not keys of the
	 * grammar; they only pass an `in`-based guard because `Object.prototype`
	 * can be reached through it.
	 */
	const inheritedKeys = ['toString', 'constructor', 'hasOwnProperty'];

	inheritedKeys.forEach(givenKey => {
		it(`should reject \`"${givenKey}"\` as an anchor key`, () => {
			const grammar = { comment: { pattern: /x/ }, string: { pattern: /y/ } };

			assert.throws(
				() => insert(grammar, givenKey, { 'new-token': { pattern: /z/ } }),
				`"${givenKey}" has to be a key of grammar.`,
			);
			assert.deepStrictEqual(Object.keys(grammar), ['comment', 'string']);
		});
	});

	it('should reject an inherited key for `insertBefore`, too', () => {
		const grammar = { comment: { pattern: /x/ }, string: { pattern: /y/ } };

		assert.throws(
			() => insertBefore(grammar, inheritedKeys[0], { 'new-token': { pattern: /z/ } }),
			`"${inheritedKeys[0]}" has to be a key of grammar.`,
		);
		assert.deepStrictEqual(Object.keys(grammar), ['comment', 'string']);
	});

	it('should reject a key that does not exist', () => {
		const grammar = { comment: { pattern: /x/ }, string: { pattern: /y/ } };

		assert.throws(
			() => insert(grammar, 'strng', { 'new-token': { pattern: /z/ } }),
			'"strng" has to be a key of grammar.',
		);
	});

	it('should insert a token before the given key', () => {
		const grammar = { comment: { pattern: /x/ }, string: { pattern: /y/ } };
		insertBefore(grammar, 'string', { number: { pattern: /\d+/ } });

		assert.deepStrictEqual(Object.keys(grammar), ['comment', 'number', 'string']);
	});

	it('should insert a token after the given key', () => {
		const grammar = { comment: { pattern: /x/ }, string: { pattern: /y/ } };
		insertAfter(grammar, 'comment', { number: { pattern: /\d+/ } });

		assert.deepStrictEqual(Object.keys(grammar), ['comment', 'number', 'string']);
	});

	it('should keep the descriptor of the existing keys', () => {
		const grammar = { comment: { pattern: /x/, greedy: true } };
		insertAfter(grammar, 'comment', { number: { pattern: /\d+/ } });

		assert.deepStrictEqual(grammar.comment, { pattern: /x/, greedy: true });
	});
});
