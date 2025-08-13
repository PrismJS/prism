import { embeddedIn } from '../shared/languages/templating.js';
import javascript from './javascript.js';
import markup from './markup.js';

/** @type {import('../types.d.ts').LanguageProto<'ejs'>} */
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
		$tokenize: embeddedIn('markup'),
	},
};
