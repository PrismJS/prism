import { embeddedIn } from '../shared/languages/templating.js';
import { tokenize } from '../shared/symbols.js';
import lua from './prism-lua.js';
import markup from './prism-markup.js';

export default /** @type {import("../types").LanguageProto<'etlua'>} */ ({
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
});
