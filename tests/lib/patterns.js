'use strict';

const { assert } = require('chai');
const PrismLoader = require('../helper/prism-loader');


describe('prism-patterns', function () {

	const Prism = PrismLoader.createInstance('patterns');
	const {
		pattern,
		toRegExp,
		template,
		nested
	} = Prism.languages.patterns;


	function assertPattern(actual, expected) {
		assert.equal(String(toRegExp(actual)), String(expected));
	}

	it('should convert to RegExp', function () {
		assertPattern(pattern('foo'), /foo/);
		assertPattern(pattern('foo', {}), /foo/);
		assertPattern(pattern('foo', { i: undefined }), /foo/);
		assertPattern(pattern('foo', { i: false }), /foo/);
		assertPattern(pattern('foo', { i: true }), /foo/i);
		assertPattern(pattern('foo', { u: true, i: true, g: true }), /foo/giu);
	});

	describe('template', function () {

		it('should work for patterns without groups', function () {
			assertPattern(
				template(/a<<0>>*<<1>>/.source, [
					'ba?',
					'bar'
				]),
				/a(?:ba?)*(?:bar)/
			);

			assertPattern(
				template(pattern(/a<<0>>*<<1>>/.source, { i: true }), [
					'01?',
					'123'
				]),
				/a(?:01?)*(?:123)/i
			);

			assertPattern(
				template(/\s<<0>>*<<1>>/.source, [
					'\\w',
					pattern('bar', { i: true })
				]),
				/\s(?:\w)*(?:bar)/i
			);
		});

		it('should work for patterns with groups and backreferences', function () {
			assertPattern(
				template(/Begin (foo|bar) <<0>> End \1/.source, [
					/(["'])(?:(?!\1)[\s\S])*\1/.source,
				]),
				/Begin (foo|bar) (?:(["'])(?:(?!\2)[\s\S])*\2) End \1/
			);
			assertPattern(
				template(/(a)<<0>>\1(b)<<0>>\2 \1/.source, [
					/(A)\1(B)/.source,
				]),
				/(a)(?:(A)\2(B))\1(b)(?:(A)\5(B))\4 \1/
			);
		});

		it('should handle escape sequences and character classes correctly', function () {
			assertPattern(
				template(/(a)\(\\[()[()]<<0>>\1/.source, [
					/(A)\1(B)/.source,
				]),
				/(a)\(\\[()[()](?:(A)\2(B))\1/
			);
			assertPattern(
				template(/<<0>>(b)\1/.source, [
					/(a)\(\\[()[()]\1/.source,
				]),
				/(?:(a)\(\\[()[()]\1)(b)\2/
			);
		});

		it('should work with \\0', function () {
			assertPattern(
				template(/(a)<<0>>\0\1/.source, [
					/(A)\1(B)/.source,
				]),
				/(a)(?:(A)\2(B))\0\1/
			);
		});

		it('should ignore escaped and invalid placeholders', function () {
			assertPattern(
				template(/\<<0>><<foo>><<0\>>[<<0>>]/.source, ['bar']),
				/\<<0>><<foo>><<0\>>[<<0>>]/
			);
		});

		it('should throw for contradictory flags', function () {
			assert.throw(() => {
				template(pattern('<<0>>', { i: true }), [
					pattern('foo', { i: false })
				]);
			});
			assert.throw(() => {
				template('<<0>><<1>>', [
					pattern('foo', { i: false }),
					pattern('bar', { i: true })
				]);
			});
		});

		it('should throw for undefined replacements', function () {
			assert.throw(() => {
				template('<<0>>', []);
			});
			assert.throw(() => {
				template('<<0>>', [undefined]);
			});
			assert.throw(() => {
				template('<<4>>', ['foo', , , , , , , 'bar']);
			});
		});

		it('should throw for early backreferences and octal escapes', function () {
			// invalid template pattern
			assert.throw(() => {
				template('(a)\\2(b)<<0>>', ['foo']);
			});
			assert.throw(() => {
				template('\\2<<0>>', ['foo']);
			});

			// invalid replacements
			assert.throw(() => {
				template('<<0>>', ['(a)\\2(b)']);
			});
			assert.throw(() => {
				template('<<0>>', ['\\2']);
			});
		});

		it('should throw for invalid patterns', function () {
			// invalid template pattern
			assert.throw(() => {
				template('(?:|<<0>>', ['foo']);
			});
			assert.throw(() => {
				template('a?+<<0>>', ['foo']);
			});

			// invalid replacements
			assert.throw(() => {
				template('<<0>>', ['(?:|<<0>>']);
			});
			assert.throw(() => {
				// even if the replacement isn't used
				template('<<0>>', ['foo', 'a?+']);
			});
		});

	});

	describe('nested', function () {

		it('should work for patterns without groups', function () {
			assertPattern(nested(/[^{}]|{<<self>>*}/.source, 1), /[^{}]|{(?:[^{}]|{(?:[^\s\S])*})*}/);
			assertPattern(nested(pattern(/[^{}]|{<<self>>*}/.source), 1), /[^{}]|{(?:[^{}]|{(?:[^\s\S])*})*}/);
			assertPattern(nested(pattern(/[^{}]|{<<self>>*}/.source, { i: true }), 1), /[^{}]|{(?:[^{}]|{(?:[^\s\S])*})*}/i);
		});

		it('should work for patterns with capturing groups and backreferences', function () {
			assertPattern(
				nested(/[^{}"']|(["'])(?:(?!\1)[^\\]|\\.)\1|{<<self>>*}/.source, 1),
				/[^{}"']|(["'])(?:(?!\1)[^\\]|\\.)\1|{(?:[^{}"']|(["'])(?:(?!\2)[^\\]|\\.)\2|{(?:[^\s\S])*})*}/
			);
		});

		it('should throw for octal escapes', function () {
			assert.throw(() => {
				nested(/[^{}]\1|{<<self>>*}/.source);
			});
			assert.throw(() => {
				nested(/[^{}]\4|{<<self>>*}/.source);
			});
		});

		it('should throw for invalid patterns', function () {
			assert.throw(() => {
				nested('(?:|<<self>>');
			});
			assert.throw(() => {
				nested('a?+');
			});
		});

	});

});
