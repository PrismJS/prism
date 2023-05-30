import { insertBefore } from '../shared/language-util';
import javadoclike from './prism-javadoclike';
import javascript from './prism-javascript';
import typescript from './prism-typescript';
import type { LanguageProto } from '../types';

export default {
	id: 'jsdoc',
	require: [javascript, javadoclike, typescript],
	grammar({ extend, getLanguage }) {
		const javascript = getLanguage('javascript');
		const typescript = getLanguage('typescript');

		const type = /\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})+\}/.source;
		const parameterPrefix = '(@(?:arg|argument|param|property)\\s+(?:' + type + '\\s+)?)';

		const jsdoc = extend('javadoclike', {
			'parameter': {
				// @param {string} foo - foo bar
				pattern: RegExp(parameterPrefix + /(?:(?!\s)[$\w\xA0-\uFFFF.])+(?=\s|$)/.source),
				lookbehind: true,
				inside: {
					'punctuation': /\./
				}
			}
		});

		insertBefore(jsdoc, 'keyword', {
			'optional-parameter': {
				// @param {string} [baz.foo="bar"] foo bar
				pattern: RegExp(parameterPrefix + /\[(?:(?!\s)[$\w\xA0-\uFFFF.])+(?:=[^[\]]+)?\](?=\s|$)/.source),
				lookbehind: true,
				inside: {
					'parameter': {
						pattern: /(^\[)[$\w\xA0-\uFFFF\.]+/,
						lookbehind: true,
						inside: {
							'punctuation': /\./
						}
					},
					'code': {
						pattern: /(=)[\s\S]*(?=\]$)/,
						lookbehind: true,
						alias: 'language-javascript',
						inside: 'javascript',
					},
					'punctuation': /[=[\]]/
				}
			},
			'class-name': [
				{
					pattern: RegExp(/(@(?:augments|class|extends|interface|memberof!?|template|this|typedef)\s+(?:<TYPE>\s+)?)[A-Z]\w*(?:\.[A-Z]\w*)*/.source.replace(/<TYPE>/g, () => type)),
					lookbehind: true,
					inside: {
						'punctuation': /\./
					}
				},
				{
					pattern: RegExp('(@[a-z]+\\s+)' + type),
					lookbehind: true,
					inside: {
						'string': javascript.string,
						'number': javascript.number,
						'boolean': javascript.boolean,
						'keyword': typescript.keyword,
						'operator': /=>|\.\.\.|[&|?:*]/,
						'punctuation': /[.,;=<>{}()[\]]/
					}
				}
			],
			'example': {
				pattern: /(@example\s+(?!\s))(?:[^@\s]|\s+(?!\s))+?(?=\s*(?:\*\s*)?(?:@\w|\*\/))/,
				lookbehind: true,
				inside: {
					'code': {
						pattern: /^([\t ]*(?:\*\s*)?)\S.*$/m,
						lookbehind: true,
						alias: 'language-javascript',
						inside: 'javascript',
					}
				}
			}
		});

		return jsdoc;
	}
} as LanguageProto<'jsdoc'>;
