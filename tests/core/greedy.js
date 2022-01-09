'use strict';

const { assert } = require('chai');
const PrismLoader = require('../helper/prism-loader');
const TestCase = require('../helper/test-case');
const TokenStreamTransformer = require('../helper/token-stream-transformer');


function testTokens({ grammar, code, expected }) {
	const Prism = PrismLoader.createEmptyPrism();
	Prism.languages.test = grammar;

	const simpleTokens = TokenStreamTransformer.simplify(TestCase.tokenize(Prism, code, 'test'));

	assert.deepStrictEqual(simpleTokens, expected);
}

describe('Greedy matching', function () {

	it('should correctly handle tokens with the same name', function () {
		testTokens({
			grammar: {
				'comment': [
					/\/\/.*/,
					{
						pattern: /\/\*[\s\S]*?(?:\*\/|$)/,
						greedy: true
					}
				]
			},
			code: '// /*\n/* comment */',
			expected: [
				['comment', '// /*'],
				['comment', '/* comment */']
			]
		});
	});

	it('should support patterns with top-level alternatives that do not contain the lookbehind group', function () {
		testTokens({
			grammar: {
				'a': /'[^']*'/,
				'b': {
					// This pattern has 2 top-level alternatives:  foo  and  (^|[^\\])"[^"]*"
					pattern: /foo|(^|[^\\])"[^"]*"/,
					lookbehind: true,
					greedy: true
				}
			},
			code: 'foo "bar" \'baz\'',
			expected: [
				['b', 'foo'],
				['b', '"bar"'],
				['a', "'baz'"]
			]
		});
	});

	it('should correctly rematch tokens', function () {
		testTokens({
			grammar: {
				'a': {
					pattern: /'[^'\r\n]*'/,
				},
				'b': {
					pattern: /"[^"\r\n]*"/,
					greedy: true,
				},
				'c': {
					pattern: /<[^>\r\n]*>/,
					greedy: true,
				}
			},
			code: `<'> '' ''\n<"> "" ""`,
			expected: [
				['c', "<'>"],
				" '",
				['a', "' '"],
				"'\n",

				['c', '<">'],
				['b', '""'],
				['b', '""'],
			]
		});
	});

	it('should always match tokens against the whole text', function () {
		// this is to test for a bug where greedy tokens where matched like non-greedy ones if the token stream ended on
		// a string
		testTokens({
			grammar: {
				'a': /a/,
				'b': {
					pattern: /^b/,
					greedy: true
				}
			},
			code: 'bab',
			expected: [
				['b', 'b'],
				['a', 'a'],
				'b'
			]
		});
	});

	it('issue3052', function () {
		// If a greedy pattern creates an empty token at the end of the string, then this token should be discarded
		testTokens({
			grammar: {
				'oh-no': {
					pattern: /$/,
					greedy: true
				}
			},
			code: 'foo',
			expected: ['foo']
		});
	});

});
