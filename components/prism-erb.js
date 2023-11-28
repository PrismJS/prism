/**
* @param {import("../prism.js").Prism} Prism
* @param {import("../prism.js").LoaderOptions} [options]
*/
import { loader as rubyLoader } from "./prism-ruby.js"
import { loader as markupTemplatingLoader } from "./prism-markup-templating.js"

export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['erb']) {
      return
    }

    rubyLoader(Prism)
    markupTemplatingLoader(Prism)

	Prism.languages.erb = {
		'delimiter': {
			pattern: /^(\s*)<%=?|%>(?=\s*$)/,
			lookbehind: true,
			alias: 'punctuation'
		},
		'ruby': {
			pattern: /\s*\S[\s\S]*/,
			alias: 'language-ruby',
			inside: Prism.languages.ruby
		}
	};

	Prism.hooks.add('before-tokenize', function (env) {
		var erbPattern = /<%=?(?:[^\r\n]|[\r\n](?!=begin)|[\r\n]=begin\s(?:[^\r\n]|[\r\n](?!=end))*[\r\n]=end)+?%>/g;
		Prism.languages['markup-templating'].buildPlaceholders(env, 'erb', erbPattern);
	});

	Prism.hooks.add('after-tokenize', function (env) {
		Prism.languages['markup-templating'].tokenizePlaceholders(env, 'erb');
	});
}