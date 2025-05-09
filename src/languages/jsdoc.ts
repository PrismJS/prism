import javadoclike from './javadoclike';
import javascript from './javascript';
import typescript from './typescript';
import type { Grammar, GrammarOptions, LanguageProto } from '../types';

export default {
	id: 'jsdoc',
	require: [javascript, typescript],
	base: javadoclike,
	grammar ({ languages }: GrammarOptions): Grammar {
		const type = /\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})+\}/.source;
		const parameterPrefix = '(@(?:arg|argument|param|property)\\s+(?:' + type + '\\s+)?)';

		return {
			'parameter': {
				// @param {string} foo - foo bar
				pattern: RegExp(parameterPrefix + /(?:(?!\s)[$\w\xA0-\uFFFF.])+(?=\s|$)/.source),
				lookbehind: true,
				inside: {
					'punctuation': /\./,
				},
			},
			$insertBefore: {
				'keyword': {
					'optional-parameter': {
						// @param {string} [baz.foo="bar"] foo bar
						pattern: RegExp(
							parameterPrefix +
								/\[(?:(?!\s)[$\w\xA0-\uFFFF.])+(?:=[^[\]]+)?\](?=\s|$)/.source
						),
						lookbehind: true,
						inside: {
							'parameter': {
								pattern: /(^\[)[$\w\xA0-\uFFFF\.]+/,
								lookbehind: true,
								inside: {
									'punctuation': /\./,
								},
							},
							'code': {
								// TODO $language
								pattern: /(=)[\s\S]*(?=\]$)/,
								lookbehind: true,
								alias: 'language-javascript',
								inside: 'javascript',
							},
							'punctuation': /[=[\]]/,
						},
					},
					'class-name': [
						{
							pattern: RegExp(
								/(@(?:augments|class|extends|interface|memberof!?|template|this|typedef)\s+(?:<TYPE>\s+)?)[A-Z]\w*(?:\.[A-Z]\w*)*/.source.replace(
									/<TYPE>/g,
									() => type
								)
							),
							lookbehind: true,
							inside: {
								'punctuation': /\./,
							},
						},
						{
							pattern: RegExp('(@[a-z]+\\s+)' + type),
							lookbehind: true,
							get inside () {
								// Lazily evaluated
								let { javascript, typescript } = languages;
								delete this.inside;
								return (this.inside = {
									'string': javascript.string,
									'number': javascript.number,
									'boolean': javascript.boolean,
									'keyword': typescript.keyword,
									'operator': /=>|\.\.\.|[&|?:*]/,
									'punctuation': /[.,;=<>{}()[\]]/,
								});
							},
						},
					],
					'example': {
						pattern:
							/(@example\s+(?!\s))(?:[^@\s]|\s+(?!\s))+?(?=\s*(?:\*\s*)?(?:@\w|\*\/))/,
						lookbehind: true,
						inside: {
							// TODO $language
							'code': {
								pattern: /^([\t ]*(?:\*\s*)?)\S.*$/m,
								lookbehind: true,
								alias: 'language-javascript',
								inside: 'javascript',
							},
						},
					},
				},
			},
		};
	},
} as LanguageProto<'jsdoc'>;
