'use strict';

const { assert } = require('chai');
const TestCase = require('./helper/test-case');
const TokenStreamTransformer = require('./helper/token-stream-transformer');


describe('The token stream transformer', () => {

	it('should handle all kinds of simple transformations', () => {
		const tokens = [
			{ type: 'type', content: 'content' },
			'string'
		];

		const expected = [
			['type', 'content'],
			'string'
		];

		assert.deepEqual(TokenStreamTransformer.simplify(tokens), expected);
	});


	it('should handle nested structures', () => {
		const tokens = [
			{
				type: 'type',
				content: [
					{
						type: 'insideType',
						content: [
							{ type: 'insideInsideType', content: 'content' }
						]
					}
				]
			}
		];

		const expected = [
			['type', [
				['insideType', [
					['insideInsideType', 'content']
				]]
			]]
		];

		assert.deepEqual(TokenStreamTransformer.simplify(tokens), expected);
	});


	it('should strip empty tokens', () => {
		const tokenStream = [
			'',
			'\r\n',
			'\t',
			' '
		];

		const expectedSimplified = [];

		assert.deepEqual(TokenStreamTransformer.simplify(tokenStream), expectedSimplified);
	});


	it('should strip empty token tree branches', () => {
		const tokenStream = [
			{
				type: 'type',
				content: [
					'',
					{ type: 'nested', content: [''] },
					''
				]
			},
			''
		];

		const expectedSimplified = [
			['type', [
				['nested', []]
			]]
		];

		assert.deepEqual(TokenStreamTransformer.simplify(tokenStream), expectedSimplified);
	});


	it('should ignore all properties in tokens except value and content', () => {

		const tokenStream = [
			{ type: 'type', content: 'content', alias: 'alias' }
		];

		const expectedSimplified = [
			['type', 'content']
		];

		assert.deepEqual(TokenStreamTransformer.simplify(tokenStream), expectedSimplified);
	});
});

describe('The language name parsing', () => {

	it('should use the last language as the main language if no language is specified', () => {
		assert.deepEqual(
			TestCase.parseLanguageNames('a'),
			{
				languages: ['a'],
				mainLanguage: 'a'
			}
		);

		assert.deepEqual(
			TestCase.parseLanguageNames('a+b+c'),
			{
				languages: ['a', 'b', 'c'],
				mainLanguage: 'c'
			}
		);
	});


	it('should use the specified language as main language', () => {
		assert.deepEqual(
			TestCase.parseLanguageNames('a+b!+c'),
			{
				languages: ['a', 'b', 'c'],
				mainLanguage: 'b'
			}
		);
	});


	it('should throw an error if there are multiple main languages', () => {
		assert.throw(
			() => {
				TestCase.parseLanguageNames('a+b!+c!');
			},
			'There are multiple main languages defined.'
		);
	});
});
