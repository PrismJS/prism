import { rest } from '../shared/symbols';
import scheme from './prism-scheme';
import type { LanguageProto } from '../types';

export default {
	id: 'lilypond',
	require: scheme,
	alias: 'ly',
	grammar() {
		let schemeExpression = /\((?:[^();"#\\]|\\[\s\S]|;.*(?!.)|"(?:[^"\\]|\\.)*"|#(?:\{(?:(?!#\})[\s\S])*#\}|[^{])|<expr>)*\)/.source;
		// allow for up to pow(2, recursivenessLog2) many levels of recursive brace expressions
		// For some reason, this can't be 4
		const recursivenessLog2 = 5;
		for (let i = 0; i < recursivenessLog2; i++) {
			schemeExpression = schemeExpression.replace(/<expr>/g, () => schemeExpression);
		}
		schemeExpression = schemeExpression.replace(/<expr>/g, /[^\s\S]/.source);


		return {
			'comment': /%(?:(?!\{).*|\{[\s\S]*?%\})/,
			'embedded-scheme': {
				pattern: RegExp(/(^|[=\s])#(?:"(?:[^"\\]|\\.)*"|[^\s()"]*(?:[^\s()]|<expr>))/.source.replace(/<expr>/g, () => schemeExpression), 'm'),
				lookbehind: true,
				greedy: true,
				inside: {
					'scheme': {
						pattern: /^(#)[\s\S]+$/,
						lookbehind: true,
						alias: 'language-scheme',
						inside: {
							'embedded-lilypond': {
								pattern: /#\{[\s\S]*?#\}/,
								greedy: true,
								inside: {
									'punctuation': /^#\{|#\}$/,
									'lilypond': {
										pattern: /[\s\S]+/,
										alias: 'language-lilypond',
										inside: 'lilypond'
									}
								}
							},
							[rest]: 'scheme'
						}
					},
					'punctuation': /#/
				}
			},
			'string': {
				pattern: /"(?:[^"\\]|\\.)*"/,
				greedy: true
			},
			'class-name': {
				pattern: /(\\new\s+)[\w-]+/,
				lookbehind: true
			},
			'keyword': {
				pattern: /\\[a-z][-\w]*/i,
				inside: {
					'punctuation': /^\\/
				}
			},
			'operator': /[=|]|<<|>>/,
			'punctuation': {
				pattern: /(^|[a-z\d])(?:'+|,+|[_^]?-[_^]?(?:[-+^!>._]|(?=\d))|[_^]\.?|[.!])|[{}()[\]<>^~]|\\[()[\]<>\\!]|--|__/,
				lookbehind: true
			},
			'number': /\b\d+(?:\/\d+)?\b/
		};
	}
} as LanguageProto<'lilypond'>;
