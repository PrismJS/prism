import ruby from './prism-ruby.js';
import markupTemplating, { MarkupTemplating } from './prism-markup-templating.js';

export default /** @type {import("../types").LanguageProto<'erb'>} */ ({
	id: 'erb',
	require: [ruby, markupTemplating],
	grammar: {
		'delimiter': {
			pattern: /^(\s*)<%=?|%>(?=\s*$)/,
			lookbehind: true,
			alias: 'punctuation'
		},
		'ruby': {
			pattern: /\s*\S[\s\S]*/,
			alias: 'language-ruby',
			inside: 'ruby'
		}
	},
	effect(Prism) {
		const pattern = /<%=?(?:[^\r\n]|[\r\n](?!=begin)|[\r\n]=begin\s(?:[^\r\n]|[\r\n](?!=end))*[\r\n]=end)+?%>/g;
		return new MarkupTemplating(this.id, Prism).addHooks(pattern);
	}
});
