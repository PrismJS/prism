import { assert } from 'chai';
import { Prism } from '../../src/core/prism.js';
import { tokenizeByNamedGroups } from '../../src/core/tokenize/util.js';
import { simplify } from '../helper/token-stream-transformer.js';

describe('Named capturing groups tokenization', () => {
	describe('tokenizeByNamedGroups', () => {
		it('should tokenize match when all named groups participate', () => {
			const regex = /(?<key>\w+)=(?<val>\w+)/d;
			const match = regex.exec('foo=bar');
			assert.isNotNull(match);
			const tokens = tokenizeByNamedGroups(/** @type {RegExpExecArray} */ (match));
			assert.deepStrictEqual(tokens, [
				{ type: 'key', content: 'foo' },
				'=',
				{ type: 'val', content: 'bar' },
			]);
		});

		it('should handle optional named groups when only one group participates (alternation)', () => {
			const regex = /(?:(?<a>a)|(?<b>b))/d;
			const matchB = regex.exec('b');
			assert.isNotNull(matchB);
			assert.isUndefined(matchB.indices?.groups?.a);
			assert.deepStrictEqual(matchB.indices?.groups?.b, [0, 1]);

			const tokensB = tokenizeByNamedGroups(/** @type {RegExpExecArray} */ (matchB));
			assert.deepStrictEqual(tokensB, [{ type: 'b', content: 'b' }]);

			const matchA = regex.exec('a');
			assert.isNotNull(matchA);
			const tokensA = tokenizeByNamedGroups(/** @type {RegExpExecArray} */ (matchA));
			assert.deepStrictEqual(tokensA, [{ type: 'a', content: 'a' }]);
		});

		it('should handle optional named group that does not participate in match', () => {
			const regex = /(?<key>\w+)(?::(?<val>\w+))?/d;
			const matchWithoutVal = regex.exec('foo');
			assert.isNotNull(matchWithoutVal);
			const tokensWithoutVal = tokenizeByNamedGroups(/** @type {RegExpExecArray} */ (matchWithoutVal));
			assert.deepStrictEqual(tokensWithoutVal, [{ type: 'key', content: 'foo' }]);

			const matchWithVal = regex.exec('foo:bar');
			assert.isNotNull(matchWithVal);
			const tokensWithVal = tokenizeByNamedGroups(/** @type {RegExpExecArray} */ (matchWithVal));
			assert.deepStrictEqual(tokensWithVal, [
				{ type: 'key', content: 'foo' },
				':',
				{ type: 'val', content: 'bar' },
			]);
		});

		it('should handle match where none of the optional named groups participate', () => {
			const regex = /(?:-(?:(?<a>a)|(?<b>b)))?/d;
			const match = regex.exec('');
			assert.isNotNull(match);
			const tokens = tokenizeByNamedGroups(/** @type {RegExpExecArray} */ (match));
			assert.deepStrictEqual(tokens, []);
		});
	});

	describe('Prism.tokenize with named groups', () => {
		it('should tokenize patterns with optional named capturing groups without throwing', () => {
			const instance = new Prism();
			const grammar = {
				thing: {
					pattern: /(?:(?<a>a)|(?<b>b))+/,
				},
			};
			instance.languageRegistry.add({ id: 'test-optional', grammar });

			const resultB = simplify(instance.tokenize('b', grammar));
			assert.deepStrictEqual(resultB, [['thing', 'b']]);

			const resultA = simplify(instance.tokenize('a', grammar));
			assert.deepStrictEqual(resultA, [['thing', 'a']]);
		});

		it('should tokenize sub-tokens for participating named capturing groups', () => {
			const instance = new Prism();
			const grammar = {
				pair: {
					pattern: /(?<key>\w+)(?::(?<val>\w+))?/,
				},
			};
			instance.languageRegistry.add({ id: 'test-pair', grammar });

			const resultSolo = simplify(instance.tokenize('foo', grammar));
			assert.deepStrictEqual(resultSolo, [['pair', 'foo']]);

			const resultPair = simplify(instance.tokenize('foo:bar', grammar));
			assert.deepStrictEqual(resultPair, [
				['pair', [['key', 'foo'], ':', ['val', 'bar']]],
			]);
		});
	});
});
