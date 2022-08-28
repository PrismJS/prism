import javascript from './prism-javascript.js';
import markupTemplating, { MarkupTemplating } from './prism-markup-templating.js';

export default /** @type {import("../types").LanguageProto<'ejs'>} */ ({
	id: 'ejs',
	require: [javascript, markupTemplating],
	alias: 'eta',
	grammar: {
		'delimiter': {
			pattern: /^<%[-_=]?|[-_]?%>$/,
			alias: 'punctuation'
		},
		'comment': /^#[\s\S]*/,
		'language-javascript': {
			pattern: /[\s\S]+/,
			inside: 'javascript'
		}
	},
	effect(Prism) {
		const pattern = /<%(?!%)[\s\S]+?%>/g;
		return new MarkupTemplating(this.id, Prism).addHooks(pattern);
	}
});
