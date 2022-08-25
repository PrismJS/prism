import markupTemplating, { MarkupTemplating } from './prism-markup-templating.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'twig',
	require: markupTemplating,
	grammar: {
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
	},
	effect(Prism) {
		const pattern = /\{(?:#[\s\S]*?#|%[\s\S]*?%|\{[\s\S]*?\})\}/g;
		return new MarkupTemplating(this.id, Prism).addHooks(pattern);
	}
});
