import { insertBefore } from '../shared/language-util';
import clike from './prism-clike';
import type { LanguageProto } from '../types';

export default {
	id: 'qsharp',
	require: clike,
	alias: 'qs',
	grammar({ extend }) {
		/**
		 * Replaces all placeholders "<<n>>" of given pattern with the n-th replacement (zero based).
		 *
		 * Note: This is a simple text based replacement. Be careful when using backreferences!
		 *
		 * @param pattern the given pattern.
		 * @param replacements a list of replacement which can be inserted into the given pattern.
		 * @returns the pattern with all placeholders replaced with their corresponding replacements.
		 * @example replace(/a<<0>>a/.source, [/b+/.source]) === /a(?:b+)a/.source
		 */
		function replace(pattern: string, replacements: string[]) {
			return pattern.replace(/<<(\d+)>>/g, (m, index) => {
				return '(?:' + replacements[+index] + ')';
			});
		}
		function re(pattern: string, replacements: string[], flags?: string) {
			return RegExp(replace(pattern, replacements), flags || '');
		}

		/**
		 * Creates a nested pattern where all occurrences of the string `<<self>>` are replaced with the pattern itself.
		 */
		function nested(pattern: string, depthLog2: number) {
			for (let i = 0; i < depthLog2; i++) {
				pattern = pattern.replace(/<<self>>/g, () => '(?:' + pattern + ')');
			}
			return pattern.replace(/<<self>>/g, '[^\\s\\S]');
		}

		// https://docs.microsoft.com/en-us/azure/quantum/user-guide/language/typesystem/
		// https://github.com/microsoft/qsharp-language/tree/main/Specifications/Language/5_Grammar
		const keywordKinds = {
			// keywords which represent a return or variable type
			type: 'Adj BigInt Bool Ctl Double false Int One Pauli PauliI PauliX PauliY PauliZ Qubit Range Result String true Unit Zero',
			// all other keywords
			other: 'Adjoint adjoint apply as auto body borrow borrowing Controlled controlled distribute elif else fail fixup for function if in internal intrinsic invert is let mutable namespace new newtype open operation repeat return self set until use using while within'
		};
		// keywords
		function keywordsToPattern(words: string) {
			return '\\b(?:' + words.trim().replace(/ /g, '|') + ')\\b';
		}
		const keywords = RegExp(keywordsToPattern(keywordKinds.type + ' ' + keywordKinds.other));

		// types
		const identifier = /\b[A-Za-z_]\w*\b/.source;
		const qualifiedName = replace(/<<0>>(?:\s*\.\s*<<0>>)*/.source, [identifier]);

		const typeInside = {
			'keyword': keywords,
			'punctuation': /[<>()?,.:[\]]/
		};

		// strings
		const regularString = /"(?:\\.|[^\\"])*"/.source;

		const qsharp = extend('clike', {
			'comment': /\/\/.*/,
			'string': [
				{
					pattern: re(/(^|[^$\\])<<0>>/.source, [regularString]),
					lookbehind: true,
					greedy: true
				}
			],
			'class-name': [
				{
					// open Microsoft.Quantum.Canon;
					// open Microsoft.Quantum.Canon as CN;
					pattern: re(/(\b(?:as|open)\s+)<<0>>(?=\s*(?:;|as\b))/.source, [qualifiedName]),
					lookbehind: true,
					inside: typeInside
				},
				{
					// namespace Quantum.App1;
					pattern: re(/(\bnamespace\s+)<<0>>(?=\s*\{)/.source, [qualifiedName]),
					lookbehind: true,
					inside: typeInside
				},
			],
			'keyword': keywords,
			'number': /(?:\b0(?:x[\da-f]+|b[01]+|o[0-7]+)|(?:\B\.\d+|\b\d+(?:\.\d*)?)(?:e[-+]?\d+)?)l?\b/i,
			'operator': /\band=|\bor=|\band\b|\bnot\b|\bor\b|<[-=]|[-=]>|>>>=?|<<<=?|\^\^\^=?|\|\|\|=?|&&&=?|w\/=?|~~~|[*\/+\-^=!%]=?/,
			'punctuation': /::|[{}[\];(),.:]/
		});

		insertBefore(qsharp, 'number', {
			'range': {
				pattern: /\.\./,
				alias: 'operator'
			}
		});

		// single line
		const interpolationExpr = nested(replace(/\{(?:[^"{}]|<<0>>|<<self>>)*\}/.source, [regularString]), 2);

		insertBefore(qsharp, 'string', {
			'interpolation-string': {
				pattern: re(/\$"(?:\\.|<<0>>|[^\\"{])*"/.source, [interpolationExpr]),
				greedy: true,
				inside: {
					'interpolation': {
						pattern: re(/((?:^|[^\\])(?:\\\\)*)<<0>>/.source, [interpolationExpr]),
						lookbehind: true,
						inside: {
							'punctuation': /^\{|\}$/,
							'expression': {
								pattern: /[\s\S]+/,
								alias: 'language-qsharp',
								inside: 'qsharp'
							}
						}
					},
					'string': /[\s\S]+/
				}
			}
		});

		return qsharp;
	}
} as LanguageProto<'qsharp'>;
