import { embeddedIn } from '../shared/languages/templating';
import { tokenize } from '../shared/symbols';
import markup from './prism-markup';
import type { LanguageProto } from '../types';

export default {
	id: 'twig',
	require: markup,
	grammar: {
		'twig-comment': {
			pattern: /\{#[\s\S]*?#\}/,
			greedy: true,
			alias: 'comment'
		},
		'twig': {
			pattern: /\{(?:#[\s\S]*?#|%[\s\S]*?%|\{[\s\S]*?\})\}/,
			greedy: true,
			inside: {
				'tag-name': {
					pattern: /(^\{%-?\s*)\w+/,
					lookbehind: true,
					alias: 'keyword'
				},
				'delimiter': {
					pattern: /^\{[{%]-?|-?[%}]\}$/,
					alias: 'punctuation'
				},

				'string': {
					pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
					inside: {
						'punctuation': /^['"]|['"]$/
					}
				},
				'keyword': /\b(?:even|if|odd)\b/,
				'boolean': /\b(?:false|null|true)\b/,
				'number': /\b0x[\dA-Fa-f]+|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee][-+]?\d+)?/,
				'operator': [
					{
						pattern: /(\s)(?:and|b-and|b-or|b-xor|ends with|in|is|matches|not|or|same as|starts with)(?=\s)/,
						lookbehind: true
					},
					/[=<>]=?|!=|\*\*?|\/\/?|\?:?|[-+~%|]/
				],
				'punctuation': /[()\[\]{}:.,]/
			}
		},
		[tokenize]: embeddedIn('markup')
	}
} as LanguageProto<'twig'>;
