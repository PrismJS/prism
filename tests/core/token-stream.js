import { assert } from 'chai';
import { getTextContent, Token } from '../../src/core/classes/token.js';
import { insertTokens, splitTokenStream, tokenMatches } from '../../src/util/token-stream.js';
import { simplify } from '../helper/token-stream-transformer.js';

/** @import { TokenStream } from '../../src/types.d.ts' */

describe('splitTokenStream', () => {
	it('should split between items without touching them', () => {
		const a = new Token('a', 'aa');
		const b = new Token('b', 'bb');

		assert.deepStrictEqual(splitTokenStream([a, 'xx', b], [2, 4]), [[a], ['xx'], [b]]);
	});

	it('should clone a straddling token into both halves, keeping type and alias', () => {
		const stream = [new Token('comment', '/* x */', ['doc', 'muted'])];
		const [left, right] = splitTokenStream(stream, [3]);

		assert.deepStrictEqual(simplify(left), [['comment', '/* ']]);
		assert.deepStrictEqual(simplify(right), [['comment', 'x */']]);
		// the halves must still carry the alias, or the classes of the original are lost
		assert.deepStrictEqual(/** @type {Token} */ (left[0]).alias, ['doc', 'muted']);
		assert.deepStrictEqual(/** @type {Token} */ (right[0]).alias, ['doc', 'muted']);
	});

	it('should split a token at every offset that falls inside it', () => {
		// a token spanning three or more runs, e.g. a block comment across three diff blocks
		const segments = splitTokenStream([new Token('a', 'abcd')], [1, 2]);

		assert.deepStrictEqual(segments.map(simplify), [[['a', 'a']], [['a', 'b']], [['a', 'cd']]]);
	});

	it('should split nested tokens recursively', () => {
		const stream = [new Token('outer', [new Token('inner', 'abcd')])];
		const [left, right] = splitTokenStream(stream, [2]);

		assert.deepStrictEqual(simplify(left), [['outer', [['inner', 'ab']]]]);
		assert.deepStrictEqual(simplify(right), [['outer', [['inner', 'cd']]]]);
	});

	it('should not modify the input', () => {
		const stream = [new Token('comment', [new Token('inner', 'abcd')])];
		splitTokenStream(stream, [1, 2, 3]);

		assert.deepStrictEqual(simplify(stream), [['comment', [['inner', 'abcd']]]]);
	});

	it('should return an empty segment per offset at the edges', () => {
		// `embed` derives its offsets from run lengths, so empty runs produce duplicate and edge offsets
		assert.deepStrictEqual(splitTokenStream(['abc'], [0, 0, 3, 3]), [[], [], ['abc'], [], []]);
	});

	it('should put a zero-length token on an offset in the segment that starts there', () => {
		// grammars can emit empty tokens (markdown's `code-block` does); putting one in the segment
		// that ends here loses it, since `embed` overwrites that segment with the next `$inner` match
		const empty = new Token('code-block', '');

		assert.deepStrictEqual(splitTokenStream([empty, 'ab'], [0]), [[], [empty, 'ab']]);
	});

	it('should give each half its own alias array', () => {
		// the halves are separate tokens, so `addAlias` on one must not reach the other or the input
		const original = new Token('comment', '/* x */', ['doc']);
		const [left, right] = splitTokenStream([original], [3]);

		/** @type {Token} */ (left[0]).addAlias('only-left');

		assert.deepStrictEqual(/** @type {Token} */ (right[0]).alias, ['doc']);
		assert.deepStrictEqual(original.alias, ['doc']);
	});

	it('should preserve the text whatever the offsets', () => {
		const stream = [new Token('a', 'ab'), 'cd'];

		for (const offsets of [[], [0], [2], [4], [1, 1], [1, 2, 3]]) {
			const segments = splitTokenStream(stream, offsets);
			const where = `offsets ${JSON.stringify(offsets)}`;

			assert.lengthOf(segments, offsets.length + 1, where);
			assert.strictEqual(segments.map(getTextContent).join(''), 'abcd', where);
		}
	});
});

describe('insertTokens', () => {
	it('should insert into the token an offset falls inside', () => {
		// the diff case: a comment spanning two deleted lines takes the prefix of the second one inside it
		/** @type {TokenStream} */
		const stream = [new Token('comment', '/* a\n   b */')];
		insertTokens(stream, [[5, new Token('prefix', '-')]]);

		assert.deepStrictEqual(simplify(stream), [
			['comment', ['/* a\n', ['prefix', '-'], '   b */']],
		]);
	});

	it('should insert at a boundary at the outermost level where it exists', () => {
		/** @type {TokenStream} */
		const stream = [new Token('a', 'ab'), new Token('b', 'cd')];
		insertTokens(stream, [[2, new Token('x', '!')]]);

		assert.deepStrictEqual(simplify(stream), [
			['a', 'ab'],
			['x', '!'],
			['b', 'cd'],
		]);
	});

	it('should reject offsets that are not ascending and non-negative', () => {
		// walking backwards slices text away without a word, so the contract is enforced, not assumed
		assert.throws(() => insertTokens(['ab', 'cdef'], [[4, new Token('a', '1')], [1, new Token('b', '2')]]), /ascending/);
		assert.throws(() => insertTokens(['ab'], [[-1, new Token('x', '@')]]), /non-negative/);
	});

	it('should split a string around many tokens without overflowing the stack', () => {
		// the string is replaced by one part per insertion, more parts than `splice` takes arguments
		/** @type {TokenStream} */
		const stream = ['x'.repeat(300_000)];
		const insertions = /** @type {[number, Token][]} */ (
			Array.from({ length: 150_000 }, (_, i) => [i * 2 + 1, new Token('t', '')])
		);

		insertTokens(stream, insertions);

		assert.lengthOf(stream, 300_001);
	});

	it('should append offsets past the end of the stream', () => {
		/** @type {TokenStream} */
		const stream = ['ab'];
		insertTokens(stream, [
			[2, new Token('x', '!')],
			[9, new Token('y', '?')],
		]);

		assert.deepStrictEqual(simplify(stream), ['ab', ['x', '!'], ['y', '?']]);
	});
});

describe('tokenMatches', () => {
	it('should match a single alias as well as a list of them', () => {
		// only `diff` ships selectors, and a token whose string alias they name always sits
		// inside a container that already matched, so nothing else covers the true case
		assert.isTrue(tokenMatches(new Token('a', 'x', 'row'), new Set(['row'])));
		assert.isTrue(tokenMatches(new Token('a', 'x', ['row']), new Set(['row'])));
		assert.isTrue(tokenMatches(new Token('row', 'x'), new Set(['row'])));
		assert.isFalse(tokenMatches(new Token('a', 'x', 'col'), new Set(['row'])));
		assert.isFalse(tokenMatches(new Token('a', 'x'), new Set(['row'])));
	});
});
