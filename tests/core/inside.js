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

describe('Inside', function () {

	it('should resolve other grammars', function () {
		const Prism = PrismLoader.createEmptyPrism();

		Prism.languages.foo = {
			'foo-token': /foo/,
		};

		Prism.languages.bar = {
			'text': {
				pattern: />.*/,
				inside: 'foo'
			}
		};

		const code = `> foo bar`;

		const simpleTokens = TokenStreamTransformer.simplify(TestCase.tokenize(Prism, code, 'bar'));
		assert.deepStrictEqual(
			simpleTokens,
			[
				['text', [
					'> ',
					['foo-token', 'foo'],
					' bar'
				]]
			]
		);
	});

	it('should resolve recursive grammars', function () {
		const Prism = PrismLoader.createEmptyPrism();

		Prism.languages.test1 = {
			'string': {
				pattern: /"(?:[^{}"]|\{[^{}]*\})*"/,
				inside: {
					'interpolation': {
						pattern: /\{[^{}]*\}/,
						inside: null // see below
					}
				}
			},
			'punctuation': /[{}]/
		};
		Prism.languages.test1.string.inside.interpolation.inside = Prism.languages.test1;

		Prism.languages.test2 = {
			'string': {
				pattern: /"(?:[^{}"]|\{[^{}]*\})*"/,
				inside: {
					'interpolation': {
						pattern: /\{[^{}]*\}/,
						inside: 'test2'
					}
				}
			},
			'punctuation': /[{}]/
		};

		const code = `"foo {"bar"}"`;

		// Same result
		assert.equal(
			Prism.highlight(code, Prism.languages.test1, 'test1'),
			Prism.highlight(code, Prism.languages.test2, 'test2')
		);

		const simpleTokens = TokenStreamTransformer.simplify(TestCase.tokenize(Prism, code, 'test2'));
		assert.deepStrictEqual(
			simpleTokens,
			[
				['string', [
					'"foo ',
					['interpolation', [
						['punctuation', '{'],
						['string', ['"bar"']],
						['punctuation', '}'],
					]],
					'"'
				]]
			]
		);
	});

	it('should ignore unknown grammars', function () {
		// this is to test for a bug where greedy tokens where matched like non-greedy ones if the token stream ended on
		// a string
		testTokens({
			grammar: {
				'string': {
					pattern: /"(?:[^{}"]|\{[^{}]*\})*"/,
					inside: 'foo'
				},
			},
			code: '"foo"',
			expected: [
				['string', '"foo"']
			]
		});
	});

});
