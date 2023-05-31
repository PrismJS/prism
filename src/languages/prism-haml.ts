import { insertBefore } from '../shared/language-util';
import ruby from './prism-ruby';
import type { Grammar, LanguageProto } from '../types';

export default {
	id: 'haml',
	require: ruby,
	grammar() {
		/* TODO
			Handle multiline code after tag
			    %foo= some |
					multiline |
					code |
		*/


		const haml = {
			// Multiline stuff should appear before the rest

			'multiline-comment': {
				pattern: /((?:^|\r?\n|\r)([\t ]*))(?:\/|-#).*(?:(?:\r?\n|\r)\2[\t ].+)*/,
				lookbehind: true,
				alias: 'comment'
			},

			'multiline-code': [
				{
					pattern: /((?:^|\r?\n|\r)([\t ]*)(?:[~-]|[&!]?=)).*,[\t ]*(?:(?:\r?\n|\r)\2[\t ].*,[\t ]*)*(?:(?:\r?\n|\r)\2[\t ].+)/,
					lookbehind: true,
					inside: 'ruby'
				},
				{
					pattern: /((?:^|\r?\n|\r)([\t ]*)(?:[~-]|[&!]?=)).*\|[\t ]*(?:(?:\r?\n|\r)\2[\t ].*\|[\t ]*)*/,
					lookbehind: true,
					inside: 'ruby'
				}
			],

			// See at the end of the file for known filters
			'filter': {
				pattern: /((?:^|\r?\n|\r)([\t ]*)):[\w-]+(?:(?:\r?\n|\r)(?:\2[\t ].+|\s*?(?=\r?\n|\r)))+/,
				lookbehind: true,
				inside: {
					'filter-name': {
						pattern: /^:[\w-]+/,
						alias: 'symbol'
					}
				}
			},

			'markup': {
				pattern: /((?:^|\r?\n|\r)[\t ]*)<.+/,
				lookbehind: true,
				inside: 'markup'
			},
			'doctype': {
				pattern: /((?:^|\r?\n|\r)[\t ]*)!!!(?: .+)?/,
				lookbehind: true
			},
			'tag': {
				// Allows for one nested group of braces
				pattern: /((?:^|\r?\n|\r)[\t ]*)[%.#][\w\-#.]*[\w\-](?:\([^)]+\)|\{(?:\{[^}]+\}|[^{}])+\}|\[[^\]]+\])*[\/<>]*/,
				lookbehind: true,
				inside: {
					'attributes': [
						{
							// Lookbehind tries to prevent interpolations from breaking it all
							// Allows for one nested group of braces
							pattern: /(^|[^#])\{(?:\{[^}]+\}|[^{}])+\}/,
							lookbehind: true,
							inside: 'ruby'
						},
						{
							pattern: /\([^)]+\)/,
							inside: {
								'attr-value': {
									pattern: /(=\s*)(?:"(?:\\.|[^\\"\r\n])*"|[^)\s]+)/,
									lookbehind: true
								},
								'attr-name': /[\w:-]+(?=\s*!?=|\s*[,)])/,
								'punctuation': /[=(),]/
							}
						},
						{
							pattern: /\[[^\]]+\]/,
							inside: 'ruby'
						}
					],
					'punctuation': /[<>]/
				}
			},
			'code': {
				pattern: /((?:^|\r?\n|\r)[\t ]*(?:[~-]|[&!]?=)).+/,
				lookbehind: true,
				inside: 'ruby'
			},
			// Interpolations in plain text
			'interpolation': {
				pattern: /#\{[^}]+\}/,
				inside: {
					'delimiter': {
						pattern: /^#\{|\}$/,
						alias: 'punctuation'
					},
					'ruby': {
						pattern: /[\s\S]+/,
						inside: 'ruby'
					}
				}
			},
			'punctuation': {
				pattern: /((?:^|\r?\n|\r)[\t ]*)[~=\-&!]+/,
				lookbehind: true
			}
		};

		const filter_pattern = '((?:^|\\r?\\n|\\r)([\\t ]*)):{{filter_name}}(?:(?:\\r?\\n|\\r)(?:\\2[\\t ].+|\\s*?(?=\\r?\\n|\\r)))+';

		// Non exhaustive list of available filters and associated languages
		const filters = [
			'css',
			{ filter: 'coffee', language: 'coffeescript' },
			'erb',
			'javascript',
			'less',
			'markdown',
			'ruby',
			'scss',
			'textile'
		];
		const all_filters: Grammar = {};
		for (const f of filters) {
			const { filter, language } = typeof f === 'string' ? { filter: f, language: f } : f;
			all_filters['filter-' + filter] = {
				pattern: RegExp(filter_pattern.replace('{{filter_name}}', () => filter)),
				lookbehind: true,
				inside: {
					'filter-name': {
						pattern: /^:[\w-]+/,
						alias: 'symbol'
					},
					'text': {
						pattern: /[\s\S]+/,
						alias: [language, 'language-' + language],
						inside: language
					}
				}
			};
		}

		insertBefore(haml, 'filter', all_filters);

		return haml;
	}
} as LanguageProto<'haml'>;
