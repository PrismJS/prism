/**
* @param {import("../prism.js").Prism} Prism
* @param {import("../prism.js").LoaderOptions} [options]
*/
import { loader as javascriptLoader } from "./prism-javascript.js"
import { loader as markupTemplatingLoader } from "./prism-markup-templating.js"
export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['ejs']) {
      return
    }

    javascriptLoader(Prism)
    markupTemplatingLoader(Prism)

	Prism.languages.ejs = {
		'delimiter': {
			pattern: /^<%[-_=]?|[-_]?%>$/,
			alias: 'punctuation'
		},
		'comment': /^#[\s\S]*/,
		'language-javascript': {
			pattern: /[\s\S]+/,
			inside: Prism.languages.javascript
		}
	};

	Prism.hooks.add('before-tokenize', function (env) {
		var ejsPattern = /<%(?!%)[\s\S]+?%>/g;
		Prism.languages['markup-templating'].buildPlaceholders(env, 'ejs', ejsPattern);
	});

	Prism.hooks.add('after-tokenize', function (env) {
		Prism.languages['markup-templating'].tokenizePlaceholders(env, 'ejs');
	});

	Prism.languages.eta = Prism.languages.ejs;
}