import { assert } from 'chai';
import { tokenize } from '../../src/core/tokenize/tokenize.js';
import { simplify } from '../helper/token-stream-transformer.js';

/** @import { TokenStream } from '../../src/types.d.ts' */

describe('whole-match named groups', () => {
	it('should keep the group type when a single group spans the whole match', () => {
		const grammar = { test: { pattern: /(?<keyword>\d+)/ } };

		const tokens = /** @type {TokenStream} */ (tokenize('42', grammar));

		assert.deepStrictEqual(simplify(tokens), [['test', [['keyword', '42']]]]);
	});

	it("should invoke the group's `inside` when a single group spans the whole match", () => {
		const grammar = {
			test: { pattern: /(?<word>\d+)/, inside: { word: () => ({ num: /\d/ }) } },
		};

		const tokens = /** @type {TokenStream} */ (tokenize('42', grammar));

		assert.deepStrictEqual(
			simplify(tokens),
			[['test', [['word', [['num', '4'], ['num', '2']]]]]],
		);
	});
});
