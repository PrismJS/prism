import ruby from './prism-ruby.js';
import markupTemplating from './prism-markup-templating.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'erb',
	require: [ruby, markupTemplating],
	grammar({ getLanguage }) {
		Prism.languages.erb = {
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
		};

		Prism.hooks.add('before-tokenize', function (env) {
			let erbPattern = /<%=?(?:[^\r\n]|[\r\n](?!=begin)|[\r\n]=begin\s(?:[^\r\n]|[\r\n](?!=end))*[\r\n]=end)+?%>/g;
			Prism.languages['markup-templating'].buildPlaceholders(env, 'erb', erbPattern);
		});

		Prism.hooks.add('after-tokenize', function (env) {
			Prism.languages['markup-templating'].tokenizePlaceholders(env, 'erb');
		});
	}
});
