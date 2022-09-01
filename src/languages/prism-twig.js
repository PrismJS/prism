import { embeddedIn } from '../shared/languages/templating';
import { tokenize } from '../shared/symbols';
import markup from './prism-markup';

export default /** @type {import("../types").LanguageProto<'twig'>} */ ({
	id: 'twig',
	require: markup,
	grammar: {
		'twig': {
			pattern: /\{(?:#[\s\S]*?#|%[\s\S]*?%|\{[\s\S]*?\})\}/,
			inside: {
				'comment': /^\{#[\s\S]*?#\}$/,

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
});
