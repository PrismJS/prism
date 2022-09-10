import { embeddedIn } from '../shared/languages/templating.js';
import { tokenize } from '../shared/symbols.js';
import markup from './prism-markup.js';

export default /** @type {import("../types").LanguageProto<'handlebars'>} */ ({
	id: 'handlebars',
	require: markup,
	alias: ['hbs', 'mustache'],
	grammar: {
		'handlebars': {
			pattern: /\{\{\{[\s\S]+?\}\}\}|\{\{[\s\S]+?\}\}/,
			inside: {
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
			}
		},
		[tokenize]: embeddedIn('markup')
	}
});
