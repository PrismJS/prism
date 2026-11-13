import { assert } from 'chai';
import { grammarPatch } from '../../src/util/grammar-patch.js';
import { isObject, isPlainObject } from '../../src/util/objects.js';

describe('grammarPatch', () => {
	describe('$insertBefore deep keys', () => {
		it('should skip gracefully when intermediate inside is a string language id', () => {
			const grammar = /** @type {Grammar} */ ({
				'code': {
					pattern: /`[^`]*`/,
					inside: 'markup',
				},
				$insertBefore: {
					'code/comment': { 'my-token': { pattern: /Y/ } },
				},
			});

			assert.doesNotThrow(() => grammarPatch(grammar));
			assert.strictEqual(/** @type {GrammarToken} */ (grammar.code).inside, 'markup');
			assert.isUndefined(grammar.$insertBefore);
		});

		it('should skip gracefully when intermediate inside is a bare RegExp', () => {
			const grammar = /** @type {Grammar} */ ({
				'code': {
					pattern: /`[^`]*`/,
					inside: /** @type {any} */ (/bare-regexp/),
				},
				$insertBefore: {
					'code/comment': { 'my-token': { pattern: /Y/ } },
				},
			});

			assert.doesNotThrow(() => grammarPatch(grammar));
			assert.isUndefined(grammar.$insertBefore);
		});

		it('should skip gracefully when intermediate inside is a function', () => {
			const fn = () => ({ 'comment': /X/ });
			const grammar = /** @type {Grammar} */ ({
				'code': {
					pattern: /`[^`]*`/,
					inside: /** @type {any} */ (fn),
				},
				$insertBefore: {
					'code/name': { 'my-token': { pattern: /Y/ } },
					'code/comment': { 'my-token': { pattern: /Y/ } },
				},
			});

			assert.doesNotThrow(() => grammarPatch(grammar));
			assert.isUndefined(grammar.$insertBefore);
		});

		it('should successfully insert when intermediate inside is a plain object', () => {
			const grammar = /** @type {Grammar} */ ({
				'code': {
					pattern: /`[^`]*`/,
					inside: {
						'comment': /X/,
					},
				},
				$insertBefore: {
					'code/comment': { 'my-token': { pattern: /Y/ } },
				},
			});

			grammarPatch(grammar);
			const inside = /** @type {Grammar} */ (
				/** @type {GrammarToken} */ (grammar.code).inside
			);
			assert.deepStrictEqual(Object.keys(inside), ['my-token', 'comment']);
		});
	});

	describe('$insertAfter deep keys', () => {
		it('should skip gracefully when intermediate inside is a string language id', () => {
			const grammar = /** @type {Grammar} */ ({
				'code': {
					pattern: /`[^`]*`/,
					inside: 'markup',
				},
				$insertAfter: {
					'code/comment': { 'my-token': { pattern: /Y/ } },
				},
			});

			assert.doesNotThrow(() => grammarPatch(grammar));
			assert.strictEqual(/** @type {GrammarToken} */ (grammar.code).inside, 'markup');
			assert.isUndefined(grammar.$insertAfter);
		});

		it('should skip gracefully when intermediate inside is a bare RegExp', () => {
			const grammar = /** @type {Grammar} */ ({
				'code': {
					pattern: /`[^`]*`/,
					inside: /** @type {any} */ (/bare-regexp/),
				},
				$insertAfter: {
					'code/comment': { 'my-token': { pattern: /Y/ } },
				},
			});

			assert.doesNotThrow(() => grammarPatch(grammar));
			assert.isUndefined(grammar.$insertAfter);
		});

		it('should successfully insert when intermediate inside is a plain object', () => {
			const grammar = /** @type {Grammar} */ ({
				'code': {
					pattern: /`[^`]*`/,
					inside: {
						'comment': /X/,
					},
				},
				$insertAfter: {
					'code/comment': { 'my-token': { pattern: /Y/ } },
				},
			});

			grammarPatch(grammar);
			const inside = /** @type {Grammar} */ (
				/** @type {GrammarToken} */ (grammar.code).inside
			);
			assert.deepStrictEqual(Object.keys(inside), ['comment', 'my-token']);
		});
	});

	describe('$merge', () => {
		it('should merge into a bare RegExp token by converting to GrammarToken', () => {
			const grammar = /** @type {Grammar} */ ({
				'string': /"[^"]*"/,
				$merge: {
					'string': { greedy: true },
				},
			});

			grammarPatch(grammar);
			assert.deepStrictEqual(grammar.string, {
				pattern: /"[^"]*"/,
				greedy: true,
			});
			assert.isUndefined(grammar.$merge);
		});

		it('should overwrite pattern when merging pattern into a bare RegExp token', () => {
			const grammar = /** @type {Grammar} */ ({
				'string': /"[^"]*"/,
				$merge: {
					'string': { pattern: /'[^']*'/, greedy: true },
				},
			});

			grammarPatch(grammar);
			assert.deepStrictEqual(grammar.string, {
				pattern: /'[^']*'/,
				greedy: true,
			});
		});

		it('should merge into an existing plain-object token', () => {
			const grammar = /** @type {Grammar} */ ({
				'string': { pattern: /"[^"]*"/ },
				$merge: {
					'string': { greedy: true },
				},
			});

			grammarPatch(grammar);
			assert.deepStrictEqual(grammar.string, {
				pattern: /"[^"]*"/,
				greedy: true,
			});
		});

		it('should merge into an array of tokens', () => {
			const grammar = /** @type {Grammar} */ ({
				'class-name': [
					{ pattern: /foo/, lookbehind: true },
					/bar/,
				],
				$merge: {
					'class-name': { alias: 'function' },
				},
			});

			grammarPatch(grammar);
			assert.deepStrictEqual(grammar['class-name'], [
				{ pattern: /foo/, lookbehind: true, alias: 'function' },
				{ pattern: /bar/, alias: 'function' },
			]);
		});

		it('should merge into nested token inside properties', () => {
			const grammar = /** @type {Grammar} */ ({
				'tag': {
					pattern: /<[^>]+>/,
					inside: {
						'attr': /attr/,
					},
				},
				$merge: {
					'tag': {
						inside: {
							'attr': { greedy: true },
						},
					},
				},
			});

			grammarPatch(grammar);
			assert.deepStrictEqual(grammar.tag, {
				pattern: /<[^>]+>/,
				inside: {
					attr: {
						pattern: /attr/,
						greedy: true,
					},
				},
			});
		});

		it('should add token if it does not exist', () => {
			const grammar = /** @type {Grammar} */ ({
				$merge: {
					'string': { pattern: /"[^"]*"/, greedy: true },
				},
			});

			grammarPatch(grammar);
			assert.deepStrictEqual(grammar.string, {
				pattern: /"[^"]*"/,
				greedy: true,
			});
		});
	});
});

describe('objects utils', () => {
	it('isPlainObject should support Object.create(null)', () => {
		const nullProto = Object.create(null);
		nullProto.foo = 'bar';
		assert.isTrue(isPlainObject(nullProto));
		assert.isFalse(isObject(nullProto, 'Object'));
	});

	it('isPlainObject should return false for primitives, functions, regexes, and arrays', () => {
		assert.isFalse(isPlainObject('string'));
		assert.isFalse(isPlainObject(123));
		assert.isFalse(isPlainObject(null));
		assert.isFalse(isPlainObject(undefined));
		assert.isFalse(isPlainObject(/regex/));
		assert.isFalse(isPlainObject([]));
		assert.isFalse(isPlainObject(() => {}));
	});
});

/**
 * @typedef {import('../../src/types.d.ts').Grammar} Grammar
 * @typedef {import('../../src/types.d.ts').GrammarToken} GrammarToken
 */
