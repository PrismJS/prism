import { assert } from 'chai';
import { parseLanguageNames } from './helper/test-case';
import { simplify } from './helper/token-stream-transformer';


describe('The token stream transformer', () => {

	it('should handle all kinds of simple transformations', () => {
		const tokens = [
			{ type: 'type', content: 'content' },
			'string'
		];

		assert.deepEqual(simplify(tokens), [
			['type', 'content'],
			'string'
		]);
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

		assert.deepEqual(simplify(tokens), [
			['type', [
				['insideType', [
					['insideInsideType', 'content']
				]]
			]]
		]);
	});


	it('should strip empty tokens', () => {
		const tokenStream = [
			'',
			'\r\n',
			'\t',
			' '
		];

		assert.deepEqual(simplify(tokenStream), []);
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

		assert.deepEqual(simplify(tokenStream), [
			['type', [
				['nested', []]
			]]
		]);
	});


	it('should ignore all properties in tokens except value and content', () => {

		const tokenStream = [
			{ type: 'type', content: 'content', alias: 'alias' }
		];

		assert.deepEqual(simplify(tokenStream), [
			['type', 'content']
		]);
	});
});

describe('The language name parsing', () => {

	it('should use the last language as the main language if no language is specified', () => {
		assert.deepEqual(
			parseLanguageNames('a'),
			{
				languages: ['a'],
				mainLanguage: 'a'
			}
		);

		assert.deepEqual(
			parseLanguageNames('a+b+c'),
			{
				languages: ['a', 'b', 'c'],
				mainLanguage: 'c'
			}
		);
	});


	it('should use the specified language as main language', () => {
		assert.deepEqual(
			parseLanguageNames('a+b!+c'),
			{
				languages: ['a', 'b', 'c'],
				mainLanguage: 'b'
			}
		);
	});


	it('should throw an error if there are multiple main languages', () => {
		assert.throw(
			() => {
				parseLanguageNames('a+b!+c!');
			},
			'There are multiple main languages defined.'
		);
	});
});
