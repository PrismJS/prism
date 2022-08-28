import lua from './prism-lua.js';
import markupTemplating, { MarkupTemplating } from './prism-markup-templating.js';

export default /** @type {import("../types").LanguageProto<'etlua'>} */ ({
	id: 'etlua',
	require: [lua, markupTemplating],
	grammar: {
		'delimiter': {
			pattern: /^<%[-=]?|-?%>$/,
			alias: 'punctuation'
		},
		'language-lua': {
			pattern: /[\s\S]+/,
			inside: 'lua'
		}
	},
	effect(Prism) {
		const pattern = /<%[\s\S]+?%>/g;
		return new MarkupTemplating(this.id, Prism).addHooks(pattern);
	}
});
