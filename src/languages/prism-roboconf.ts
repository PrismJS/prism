import type { LanguageProto } from '../types';

export default {
	id: 'roboconf',
	grammar: {
		'comment': /#.*/,
		'keyword': {
			'pattern': /(^|\s)(?:(?:external|import)\b|(?:facet|instance of)(?=[ \t]+[\w-]+[ \t]*\{))/,
			lookbehind: true
		},
		'component': {
			pattern: /[\w-]+(?=[ \t]*\{)/,
			alias: 'variable'
		},
		'property': /[\w.-]+(?=[ \t]*:)/,
		'value': {
			pattern: /(=[ \t]*(?![ \t]))[^,;]+/,
			lookbehind: true,
			alias: 'attr-value'
		},
		'optional': {
			pattern: /\(optional\)/,
			alias: 'builtin'
		},
		'wildcard': {
			pattern: /(\.)\*/,
			lookbehind: true,
			alias: 'operator'
		},
		'punctuation': /[{},.;:=]/
	}
} as LanguageProto<'roboconf'>;
