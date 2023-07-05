import { embeddedIn } from '../shared/languages/templating.js';
import { tokenize } from '../shared/symbols.js';
import markup from './prism-markup.js';
import ruby from './prism-ruby.js';
import type { LanguageProto } from '../types';

export default {
	id: 'erb',
	require: [ruby, markup],
	grammar: {
		'erb': {
			pattern: /<%=?(?:[^\r\n]|[\r\n](?!=begin)|[\r\n]=begin\s(?:[^\r\n]|[\r\n](?!=end))*[\r\n]=end)+?%>/,
			inside: {
				'delimiter': {
					pattern: /^<%=?|%>$/,
					alias: 'punctuation'
				},
				'ruby': {
					pattern: /\s*\S[\s\S]*/,
					alias: 'language-ruby',
					inside: 'ruby'
				}
			}
		},
		[tokenize]: embeddedIn('markup')
	}
} as LanguageProto<'erb'>;
