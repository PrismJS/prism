import { embeddedIn } from '../shared/languages/templating.js';
import { tokenize } from '../shared/symbols.js';
import javascript from './prism-javascript.js';
import markup from './prism-markup.js';
import type { LanguageProto } from '../types';

export default {
	id: 'ejs',
	require: [javascript, markup],
	alias: 'eta',
	grammar: {
		'ejs-comment': {
			pattern: /<%#[\s\S]*?%>/,
			greedy: true
		},
		'escape': {
			pattern: /<%%|%%>/,
			greedy: true
		},
		'ejs': {
			pattern: /<%(?![%#])[\s\S]*?%>/,
			greedy: true,
			inside: {
				'delimiter': {
					pattern: /^<%[-_=]?|[-_]?%>$/,
					alias: 'punctuation'
				},
				'language-javascript': {
					pattern: /[\s\S]+/,
					inside: 'javascript'
				}
			}
		},
		[tokenize]: embeddedIn('markup')
	}
} as LanguageProto<'ejs'>;
