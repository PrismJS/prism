import { embeddedIn } from '../shared/languages/templating';
import { tokenize } from '../shared/symbols';
import javascript from './prism-javascript';
import markup from './prism-markup';

export default /** @type {import("../types").LanguageProto<'ejs'>} */ ({
	id: 'ejs',
	require: [javascript, markup],
	alias: 'eta',
	grammar: {
		'ejs': {
			pattern: /<%(?!%)[\s\S]+?%>/,
			inside: {
				'delimiter': {
					pattern: /^<%[-_=]?|[-_]?%>$/,
					alias: 'punctuation'
				},
				'comment': /^#[\s\S]*/,
				'language-javascript': {
					pattern: /[\s\S]+/,
					inside: 'javascript'
				}
			}
		},
		[tokenize]: embeddedIn('markup')
	}
});
