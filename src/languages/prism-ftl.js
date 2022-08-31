import { embeddedIn } from '../shared/languages/templating';
import { rest, tokenize } from '../shared/symbols';
import markup from './prism-markup';

export default /** @type {import("../types").LanguageProto<'ftl'>} */ ({
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
						[rest]: /** @type {import('../types').Grammar[rest]} */ (null) // see below
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
			'ftl': {
				// eslint-disable-next-line regexp/no-useless-lazy
				pattern: RegExp(/<#--[\s\S]*?-->|<\/?[#@][a-zA-Z](?:<expr>)*?>|\$\{(?:<expr>)*?\}/.source.replace(/<expr>/g, () => FTL_EXPR), 'i'),
				inside: {
					'ftl-comment': {
						// the pattern is shortened to be more efficient
						pattern: /^<#--[\s\S]*/,
						alias: 'comment'
					},
					'ftl-directive': {
						pattern: /^<[\s\S]+>$/,
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
						pattern: /^\$\{[\s\S]*\}$/,
						inside: {
							'punctuation': /^\$\{|\}$/,
							'content': {
								pattern: /\s*\S[\s\S]*/,
								alias: 'ftl',
								inside: ftl
							}
						}
					}
				}
			},
			[tokenize]: embeddedIn('markup')
		};
	}
});
