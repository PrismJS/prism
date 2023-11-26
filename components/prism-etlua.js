import { loader as markupTemplatingLoader } from "./prism-markup-templating.js"
import { loader as luaLoader } from "./prism-lua.js"
export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['etlua']) {
      return
    }

	markupTemplatingLoader(Prism)
    luaLoader(Prism)

	Prism.languages.etlua = {
		'delimiter': {
			pattern: /^<%[-=]?|-?%>$/,
			alias: 'punctuation'
		},
		'language-lua': {
			pattern: /[\s\S]+/,
			inside: Prism.languages.lua
		}
	};

	Prism.hooks.add('before-tokenize', function (env) {
		var pattern = /<%[\s\S]+?%>/g;
		Prism.languages['markup-templating'].buildPlaceholders(env, 'etlua', pattern);
	});

	Prism.hooks.add('after-tokenize', function (env) {
		Prism.languages['markup-templating'].tokenizePlaceholders(env, 'etlua');
	});
}