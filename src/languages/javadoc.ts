import java from './java';
import javadoclike from './javadoclike';
import markup from './markup';
import type { LanguageProto } from '../types';

export default {
	id: 'javadoc',
	base: javadoclike,
	require: [markup, java],
	grammar ({ languages }) {
		const java = languages.java;
		const { tag, entity } = languages.markup;

		const codeLinePattern = /(^(?:[\t ]*(?:\*\s*)*))[^*\s].*$/m;

		const memberReference = /#\s*\w+(?:\s*\([^()]*\))?/.source;
		const reference = /(?:\b[a-zA-Z]\w+\s*\.\s*)*\b[A-Z]\w*(?:\s*<mem>)?|<mem>/.source.replace(
			/<mem>/g,
			() => memberReference
		);

		return {
			$insertBefore: {
				'keyword': {
					'reference': {
						pattern: RegExp(
							/(@(?:exception|link|linkplain|see|throws|value)\s+(?:\*\s*)?)/.source +
								'(?:' +
								reference +
								')'
						),
						lookbehind: true,
						inside: {
							'function': {
								pattern: /(#\s*)\w+(?=\s*\()/,
								lookbehind: true,
							},
							'field': {
								pattern: /(#\s*)\w+/,
								lookbehind: true,
							},
							'namespace': {
								pattern: /\b(?:[a-z]\w*\s*\.\s*)+/,
								inside: {
									'punctuation': /\./,
								},
							},
							'class-name': /\b[A-Z]\w*/,
							'keyword': java.keyword,
							'punctuation': /[#()[\],.]/,
						},
					},
					'class-name': {
						// @param <T> the first generic type parameter
						pattern: /(@param\s+)<[A-Z]\w*>/,
						lookbehind: true,
						inside: {
							'punctuation': /[.<>]/,
						},
					},
					'code-section': [
						{
							pattern:
								/(\{@code\s+(?!\s))(?:[^\s{}]|\s+(?![\s}])|\{(?:[^{}]|\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\})*\})+(?=\s*\})/,
							lookbehind: true,
							inside: {
								'code': {
									// there can't be any HTML inside of {@code} tags
									pattern: codeLinePattern,
									lookbehind: true,
									inside: 'java',
									alias: 'language-java',
								},
							},
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
											alias: 'language-java',
										},
									},
								},
							},
						},
					],
					'tag': tag,
					'entity': entity,
				},
			},
		};
	},
} as LanguageProto<'javadoc'>;
