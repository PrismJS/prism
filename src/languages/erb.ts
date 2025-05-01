import { embeddedIn } from '../shared/languages/templating';
import markup from './markup';
import ruby from './ruby';
import type { LanguageProto } from '../types';

export default {
	id: 'erb',
	require: [ruby, markup],
	grammar: {
		'erb': {
			pattern:
				/<%=?(?:[^\r\n]|[\r\n](?!=begin)|[\r\n]=begin\s(?:[^\r\n]|[\r\n](?!=end))*[\r\n]=end)+?%>/,
			inside: {
				'delimiter': {
					pattern: /^<%=?|%>$/,
					alias: 'punctuation',
				},
				'ruby': {
					pattern: /\s*\S[\s\S]*/,
					alias: 'language-ruby',
					inside: 'ruby',
				},
			},
		},
		$tokenize: embeddedIn('markup'),
	},
} as LanguageProto<'erb'>;
