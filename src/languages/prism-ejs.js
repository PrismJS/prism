import javascript from './prism-javascript.js';
import markupTemplating from './prism-markup-templating.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'ejs',
	require: [javascript, markupTemplating],
	alias: 'eta',
	grammar({ getLanguage }) {
		Prism.languages.ejs = {
			'delimiter': {
				pattern: /^<%[-_=]?|[-_]?%>$/,
				alias: 'punctuation'
			},
			'comment': /^#[\s\S]*/,
			'language-javascript': {
				pattern: /[\s\S]+/,
				inside: 'javascript'
			}
		};

		Prism.hooks.add('before-tokenize', function (env) {
			let ejsPattern = /<%(?!%)[\s\S]+?%>/g;
			Prism.languages['markup-templating'].buildPlaceholders(env, 'ejs', ejsPattern);
		});

		Prism.hooks.add('after-tokenize', function (env) {
			Prism.languages['markup-templating'].tokenizePlaceholders(env, 'ejs');
		});
	}
});
