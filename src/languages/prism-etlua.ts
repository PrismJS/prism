import { embeddedIn } from '../shared/languages/templating.js';
import { tokenize } from '../shared/symbols.js';
import lua from './prism-lua.js';
import markup from './prism-markup.js';
import type { LanguageProto } from '../types';

export default {
	id: 'etlua',
	require: [lua, markup],
	grammar: {
		'etlua': {
			pattern: /<%[\s\S]+?%>/,
			inside: {
				'delimiter': {
					pattern: /^<%[-=]?|-?%>$/,
					alias: 'punctuation'
				},
				'language-lua': {
					pattern: /[\s\S]+/,
					inside: 'lua'
				}
			}
		},
		[tokenize]: embeddedIn('markup')
	}
} as LanguageProto<'etlua'>;
