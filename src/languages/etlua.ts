import { embeddedIn } from '../shared/languages/templating';
import lua from './lua';
import markup from './markup';
import type { Grammar, LanguageProto } from '../types';

export default {
	id: 'etlua',
	require: [lua, markup],
	grammar: {
		'etlua': {
			pattern: /<%[\s\S]+?%>/,
			inside: {
				'delimiter': {
					pattern: /^<%[-=]?|-?%>$/,
					alias: 'punctuation',
				},
				'language-lua': {
					pattern: /[\s\S]+/,
					inside: 'lua',
				},
			},
		},
		$tokenize: embeddedIn('markup') as Grammar['$tokenize'],
	},
} as LanguageProto<'etlua'>;
