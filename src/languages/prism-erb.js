import { embeddedIn } from '../shared/languages/templating';
import { tokenize } from '../shared/symbols';
import markup from './prism-markup';
import ruby from './prism-ruby';

export default /** @type {import("../types").LanguageProto<'erb'>} */ ({
	id: 'erb',
	require: [ruby, markup],
	grammar: {
		'erb': {
			pattern: /<%=?(?:[^\r\n]|[\r\n](?!=begin)|[\r\n]=begin\s(?:[^\r\n]|[\r\n](?!=end))*[\r\n]=end)+?%>/,
			inside: {
				'delimiter': {
					pattern: /^<%=?|%>$/,
					lookbehind: true,
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
});
