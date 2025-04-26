import { insertBefore } from '../shared/language-util';
import clike from './clike';
import type { LanguageProto } from '../types';

export default {
	id: 'd',
	require: clike,
	grammar ({ extend }) {
		const d = extend('clike', {
			'comment': [
				{
					// Shebang
					pattern: /^\s*#!.+/,
					greedy: true,
				},
				{
					pattern: RegExp(
						/(^|[^\\])/.source +
							'(?:' +
							[
								// /+ comment +/
								// Allow one level of nesting
								/\/\+(?:\/\+(?:[^+]|\+(?!\/))*\+\/|(?!\/\+)[\s\S])*?\+\//.source,
								// // comment
								/\/\/.*/.source,
								// /* comment */
								/\/\*[\s\S]*?\*\//.source,
							].join('|') +
							')'
					),
					lookbehind: true,
					greedy: true,
				},
			],
			'string': [
				{
					pattern: RegExp(
						[
							// r"", x""
							/\b[rx]"(?:\\[\s\S]|[^\\"])*"[cwd]?/.source,

							// q"[]", q"()", q"<>", q"{}"
							/\bq"(?:\[[\s\S]*?\]|\([\s\S]*?\)|<[\s\S]*?>|\{[\s\S]*?\})"/.source,

							// q"IDENT
							// ...
							// IDENT"
							/\bq"((?!\d)\w+)$[\s\S]*?^\1"/.source,

							// q"//", q"||", etc.
							// @ts-expect-error TS(2532): Ignore the non-existent capturing group error.
							/\bq"(.)[\s\S]*?\2"/.source, // eslint-disable-line regexp/strict

							// @ts-expect-error TS(2532): Ignore the non-existent capturing group error.
							/(["`])(?:\\[\s\S]|(?!\3)[^\\])*\3[cwd]?/.source, // eslint-disable-line regexp/strict
						].join('|'),
						'm'
					),
					greedy: true,
				},
				{
					pattern: /\bq\{(?:\{[^{}]*\}|[^{}])*\}/,
					greedy: true,
					alias: 'token-string',
				},
			],

			// In order: $, keywords and special tokens, globally defined symbols
			'keyword':
				/\$|\b(?:__(?:(?:DATE|EOF|FILE|FUNCTION|LINE|MODULE|PRETTY_FUNCTION|TIME|TIMESTAMP|VENDOR|VERSION)__|gshared|parameters|traits|vector)|abstract|alias|align|asm|assert|auto|body|bool|break|byte|case|cast|catch|cdouble|cent|cfloat|char|class|const|continue|creal|dchar|debug|default|delegate|delete|deprecated|do|double|dstring|else|enum|export|extern|false|final|finally|float|for|foreach|foreach_reverse|function|goto|idouble|if|ifloat|immutable|import|inout|int|interface|invariant|ireal|lazy|long|macro|mixin|module|new|nothrow|null|out|override|package|pragma|private|protected|ptrdiff_t|public|pure|real|ref|return|scope|shared|short|size_t|static|string|struct|super|switch|synchronized|template|this|throw|true|try|typedef|typeid|typeof|ubyte|ucent|uint|ulong|union|unittest|ushort|version|void|volatile|wchar|while|with|wstring)\b/,

			'number': [
				// The lookbehind and the negative look-ahead try to prevent bad highlighting of the .. operator
				// Hexadecimal numbers must be handled separately to avoid problems with exponent "e"
				/\b0x\.?[a-f\d_]+(?:(?!\.\.)\.[a-f\d_]*)?(?:p[+-]?[a-f\d_]+)?[ulfi]{0,4}/i,
				{
					pattern:
						/((?:\.\.)?)(?:\b0b\.?|\b|\.)\d[\d_]*(?:(?!\.\.)\.[\d_]*)?(?:e[+-]?\d[\d_]*)?[ulfi]{0,4}/i,
					lookbehind: true,
				},
			],

			'operator':
				/\|[|=]?|&[&=]?|\+[+=]?|-[-=]?|\.?\.\.|=[>=]?|!(?:i[ns]\b|<>?=?|>=?|=)?|\bi[ns]\b|(?:<[<>]?|>>?>?|\^\^|[*\/%^~])=?/,
		});

		insertBefore(d, 'string', {
			// Characters
			// 'a', '\\', '\n', '\xFF', '\377', '\uFFFF', '\U0010FFFF', '\quot'
			'char': /'(?:\\(?:\W|\w+)|[^\\])'/,
		});

		insertBefore(d, 'keyword', {
			'property': /\B@\w*/,
		});

		insertBefore(d, 'function', {
			'register': {
				// Iasm registers
				pattern:
					/\b(?:[ABCD][LHX]|E?(?:BP|DI|SI|SP)|[BS]PL|CR[0234]|[ECSDGF]S|[DS]IL|DR[012367]|E[ABCD]X|X?MM[0-7]|R(?:1[0-5]|[89])[BWD]?|R[ABCD]X|R[BS]P|R[DS]I|TR[3-7]|XMM(?:1[0-5]|[89])|YMM(?:1[0-5]|\d))\b|\bST(?:\([0-7]\)|\b)/,
				alias: 'variable',
			},
		});

		return d;
	},
} as LanguageProto<'d'>;
