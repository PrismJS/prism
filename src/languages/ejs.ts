import { embeddedIn } from '../shared/languages/templating';
import javascript from './javascript';
import markup from './markup';
import type { Grammar, LanguageProto } from '../types';

export default {
	id: 'ejs',
	require: [javascript, markup],
	alias: 'eta',
	grammar: {
		'ejs-comment': {
			pattern: /<%#[\s\S]*?%>/,
			greedy: true,
		},
		'escape': {
			pattern: /<%%|%%>/,
			greedy: true,
		},
		'ejs': {
			pattern: /<%(?![%#])[\s\S]*?%>/,
			greedy: true,
			inside: {
				'delimiter': {
					pattern: /^<%[-_=]?|[-_]?%>$/,
					alias: 'punctuation',
				},
				'language-javascript': {
					pattern: /[\s\S]+/,
					inside: 'javascript',
				},
			},
		},
		$tokenize: embeddedIn('markup') as Grammar['$tokenize'],
	},
} as LanguageProto<'ejs'>;
