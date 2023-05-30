import type { LanguageProto } from "../types";
import { embeddedIn } from '../shared/languages/templating';
import { tokenize } from '../shared/symbols';
import lua from './prism-lua';
import markup from './prism-markup';

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
} as LanguageProto<'etlua'>
