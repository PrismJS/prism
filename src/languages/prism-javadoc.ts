import { insertBefore } from '../shared/language-util';
import java from './prism-java';
import javadoclike from './prism-javadoclike';
import markup from './prism-markup';
import type { LanguageProto } from '../types';

export default {
	id: 'javadoc',
	require: [markup, java, javadoclike],
	grammar({ extend, getLanguage }) {
		const java = getLanguage('java');
		const { tag, entity } = getLanguage('markup');

		const codeLinePattern = /(^(?:[\t ]*(?:\*\s*)*))[^*\s].*$/m;

		const memberReference = /#\s*\w+(?:\s*\([^()]*\))?/.source;
		const reference = /(?:\b[a-zA-Z]\w+\s*\.\s*)*\b[A-Z]\w*(?:\s*<mem>)?|<mem>/.source.replace(/<mem>/g, () => memberReference);

		const javadoc = extend('javadoclike', {});
		insertBefore(javadoc, 'keyword', {
			'reference': {
				pattern: RegExp(/(@(?:exception|link|linkplain|see|throws|value)\s+(?:\*\s*)?)/.source + '(?:' + reference + ')'),
				lookbehind: true,
				inside: {
					'function': {
						pattern: /(#\s*)\w+(?=\s*\()/,
						lookbehind: true
					},
					'field': {
						pattern: /(#\s*)\w+/,
						lookbehind: true
					},
					'namespace': {
						pattern: /\b(?:[a-z]\w*\s*\.\s*)+/,
						inside: {
							'punctuation': /\./
						}
					},
					'class-name': /\b[A-Z]\w*/,
					'keyword': java.keyword,
					'punctuation': /[#()[\],.]/
				}
			},
			'class-name': {
				// @param <T> the first generic type parameter
				pattern: /(@param\s+)<[A-Z]\w*>/,
				lookbehind: true,
				inside: {
					'punctuation': /[.<>]/
				}
			},
			'code-section': [
				{
					pattern: /(\{@code\s+(?!\s))(?:[^\s{}]|\s+(?![\s}])|\{(?:[^{}]|\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\})*\})+(?=\s*\})/,
					lookbehind: true,
					inside: {
						'code': {
							// there can't be any HTML inside of {@code} tags
							pattern: codeLinePattern,
							lookbehind: true,
							inside: 'java',
							alias: 'language-java'
						}
					}
				},
				{
					pattern: /(<(code|pre|tt)>(?!<code>)\s*)\S(?:\S|\s+\S)*?(?=\s*<\/\2>)/,
					lookbehind: true,
					inside: {
						'line': {
							pattern: codeLinePattern,
							lookbehind: true,
							inside: {
								// highlight HTML tags and entities
								'tag': tag,
								'entity': entity,
								'code': {
									// everything else is Java code
									pattern: /.+/,
									inside: 'java',
									alias: 'language-java'
								}
							}
						}
					}
				}
			],
			'tag': tag,
			'entity': entity,
		});

		return javadoc;
	}
} as LanguageProto<'javadoc'>;
