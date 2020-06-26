"use strict";

const { assert } = require('chai');
const PrismLoader = require('../helper/prism-loader');
const TestCase = require('../helper/test-case');


function testTokens({ grammar, code, expected }) {
	const Prism = PrismLoader.createEmptyPrism();
	Prism.languages.test = grammar;

	const simpleTokens = TestCase.simpleTokenize(Prism, code, 'test');

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
				["comment", "// /*"],
				["comment", "/* comment */"]
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
				["b", "foo"],
				["b", "\"bar\""],
				["a", "'baz'"]
			]
		});
	});

	// https://github.com/PrismJS/prism/issues/1492
	/*
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
				["c", "<'>"],
				["a", "''"],
				["a", "''"],

				["c", "<\">"],
				["b", "\"\""],
				["b", "\"\""],
			]
		});
	});
	*/
});
