import markupTemplating, { MarkupTemplating } from './prism-markup-templating';

export default /** @type {import("../types").LanguageProto<'handlebars'>} */ ({
	id: 'handlebars',
	require: markupTemplating,
	alias: ['hbs', 'mustache'],
	grammar: {
		'comment': /\{\{![\s\S]*?\}\}/,
		'delimiter': {
			pattern: /^\{\{\{?|\}\}\}?$/,
			alias: 'punctuation'
		},
		'string': /(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,
		'number': /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee][+-]?\d+)?/,
		'boolean': /\b(?:false|true)\b/,
		'block': {
			pattern: /^(\s*(?:~\s*)?)[#\/]\S+?(?=\s*(?:~\s*)?$|\s)/,
			lookbehind: true,
			alias: 'keyword'
		},
		'brackets': {
			pattern: /\[[^\]]+\]/,
			inside: {
				punctuation: /\[|\]/,
				variable: /[\s\S]+/
			}
		},
		'punctuation': /[!"#%&':()*+,.\/;<=>@\[\\\]^`{|}~]/,
		'variable': /[^!"#%&'()*+,\/;<=>@\[\\\]^`{|}~\s]+/
	},
	effect(Prism) {
		const pattern = /\{\{\{[\s\S]+?\}\}\}|\{\{[\s\S]+?\}\}/g;
		return new MarkupTemplating(this.id, Prism).addHooks(pattern);
	}
});
