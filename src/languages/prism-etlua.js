import lua from './prism-lua.js';
import markupTemplating from './prism-markup-templating.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'etlua',
	require: [lua, markupTemplating],
	grammar({ getLanguage }) {
		Prism.languages.etlua = {
			'delimiter': {
				pattern: /^<%[-=]?|-?%>$/,
				alias: 'punctuation'
			},
			'language-lua': {
				pattern: /[\s\S]+/,
				inside: 'lua'
			}
		};

		Prism.hooks.add('before-tokenize', function (env) {
			let pattern = /<%[\s\S]+?%>/g;
			Prism.languages['markup-templating'].buildPlaceholders(env, 'etlua', pattern);
		});

		Prism.hooks.add('after-tokenize', function (env) {
			Prism.languages['markup-templating'].tokenizePlaceholders(env, 'etlua');
		});
	}
});
