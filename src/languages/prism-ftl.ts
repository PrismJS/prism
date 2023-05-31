import { embeddedIn } from '../shared/languages/templating';
import { rest, tokenize } from '../shared/symbols';
import markup from './prism-markup';
import type { Grammar, LanguageProto } from '../types';

export default {
	id: 'ftl',
	require: markup,
	grammar() {
		// https://freemarker.apache.org/docs/dgui_template_exp.html

		// FTL expression with 4 levels of nesting supported
		let FTL_EXPR = /[^<()"']|\((?:<expr>)*\)|<(?!#--)|<#--(?:[^-]|-(?!->))*-->|"(?:[^\\"]|\\.)*"|'(?:[^\\']|\\.)*'/.source;
		for (let i = 0; i < 2; i++) {
			FTL_EXPR = FTL_EXPR.replace(/<expr>/g, () => FTL_EXPR);
		}
		FTL_EXPR = FTL_EXPR.replace(/<expr>/g, /[^\s\S]/.source);

		const stringInterpolation = {
			pattern: RegExp(/("|')(?:(?!\1|\$\{)[^\\]|\\.|\$\{(?:(?!\})(?:<expr>))*\})*\1/.source.replace(/<expr>/g, () => FTL_EXPR)),
			greedy: true,
			inside: {
				'interpolation': {
					pattern: RegExp(/((?:^|[^\\])(?:\\\\)*)\$\{(?:(?!\})(?:<expr>))*\}/.source.replace(/<expr>/g, () => FTL_EXPR)),
					lookbehind: true,
					inside: {
						'interpolation-punctuation': {
							pattern: /^\$\{|\}$/,
							alias: 'punctuation'
						},
						[rest]: null as Grammar[typeof rest] // see below
					}
				}
			}
		};

		const ftl = {
			'comment': /<#--[\s\S]*?-->/,
			'string': [
				{
					// raw string
					pattern: /\br("|')(?:(?!\1)[^\\]|\\.)*\1/,
					greedy: true
				},
				stringInterpolation
			],
			'keyword': /\b(?:as)\b/,
			'boolean': /\b(?:false|true)\b/,
			'builtin-function': {
				pattern: /((?:^|[^?])\?\s*)\w+/,
				lookbehind: true,
				alias: 'function'
			},
			'function': /\b\w+(?=\s*\()/,
			'number': /\b\d+(?:\.\d+)?\b/,
			'operator': /\.\.[<*!]?|->|--|\+\+|&&|\|\||\?{1,2}|[-+*/%!=<>]=?|\b(?:gt|gte|lt|lte)\b/,
			'punctuation': /[,;.:()[\]{}]/
		};

		stringInterpolation.inside.interpolation.inside[rest] = ftl;

		return {
			'ftl-comment': {
				// the pattern is shortened to be more efficient
				pattern: /<#--[\s\S]*?-->/,
				greedy: true,
				alias: 'comment'
			},
			'ftl-directive': {
				// eslint-disable-next-line regexp/no-useless-lazy
				pattern: RegExp(/<\/?[#@][a-zA-Z](?:<expr>)*?>/.source.replace(/<expr>/g, () => FTL_EXPR), 'i'),
				greedy: true,
				inside: {
					'directive': {
						pattern: /(^<\/?)[#@][a-z]\w*/i,
						lookbehind: true,
						alias: 'keyword'
					},
					'punctuation': /^<\/?|\/?>$/,
					'content': {
						pattern: /\s*\S[\s\S]*/,
						alias: 'ftl',
						inside: ftl
					}
				}
			},
			'ftl-interpolation': {
				// eslint-disable-next-line regexp/no-useless-lazy
				pattern: RegExp(/\$\{(?:<expr>)*?\}/.source.replace(/<expr>/g, () => FTL_EXPR), 'i'),
				greedy: true,
				inside: {
					'punctuation': /^\$\{|\}$/,
					'content': {
						pattern: /\s*\S[\s\S]*/,
						alias: 'ftl',
						inside: ftl
					}
				}
			},
			[tokenize]: embeddedIn('markup')
		};
	}
} as LanguageProto<'ftl'>;
