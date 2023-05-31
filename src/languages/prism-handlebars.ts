import { embeddedIn } from '../shared/languages/templating';
import { tokenize } from '../shared/symbols';
import markup from './prism-markup';
import type { LanguageProto } from '../types';

export default {
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
} as LanguageProto<'handlebars'>;
