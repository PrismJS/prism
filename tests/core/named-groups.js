import { assert } from 'chai';
import { tokenize } from '../../src/core/tokenize/tokenize.js';
import { simplify } from '../helper/token-stream-transformer.js';

/** @import { TokenStream } from '../../src/types.d.ts' */

describe('named capturing groups', () => {
	it('should skip named groups that do not participate in the match', () => {
		// `keyword` takes part and `ident` does not (they share an alternation),
		// while `rest` matches in both groupings — two groups are live, yet
		// `match.indices.groups` still holds `undefined` for `ident`
		const grammar = {
			thing: { pattern: /(?:(?<keyword>if)|(?<ident>\w))(?<rest>\w+)!/ },
		};

		const tokens = /** @type {TokenStream} */ (tokenize('ifyou!', grammar));

		assert.deepStrictEqual(
			simplify(tokens),
			[['thing', [['keyword', 'if'], ['rest', 'you'], '!']]],
		);
	});
});
