/**
* @param {import("../prism.js").Prism} Prism
* @param {import("../prism.js").LoaderOptions} [options]
*/
import { loader as markupLoader } from "./prism-markup.js"
import { loader as csharpLoader } from "./prism-csharp.js"
import { loader as javascriptLoader } from "./prism-javascript.js"
export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['aspnet']) {
      return
    }

	markupLoader(Prism)
	javascriptLoader(Prism)
	csharpLoader(Prism)

	Prism.languages.aspnet = Prism.languages.extend('markup', {
		'page-directive': {
			pattern: /<%\s*@.*%>/,
			alias: 'tag',
			inside: {
				'page-directive': {
					pattern: /<%\s*@\s*(?:Assembly|Control|Implements|Import|Master(?:Type)?|OutputCache|Page|PreviousPageType|Reference|Register)?|%>/i,
					alias: 'tag'
				},
				rest: Prism.languages.markup.tag.inside
			}
		},
		'directive': {
			pattern: /<%.*%>/,
			alias: 'tag',
			inside: {
				'directive': {
					pattern: /<%\s*?[$=%#:]{0,2}|%>/,
					alias: 'tag'
				},
				rest: Prism.languages.csharp
			}
		}
	});
	// Regexp copied from prism-markup, with a negative look-ahead added
	Prism.languages.aspnet.tag.pattern = /<(?!%)\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/;

	// match directives of attribute value foo="<% Bar %>"
	Prism.languages.insertBefore('inside', 'punctuation', {
		'directive': Prism.languages.aspnet['directive']
	}, Prism.languages.aspnet.tag.inside['attr-value']);

	Prism.languages.insertBefore('aspnet', 'comment', {
		'asp-comment': {
			pattern: /<%--[\s\S]*?--%>/,
			alias: ['asp', 'comment']
		}
	});

	// script runat="server" contains csharp, not javascript
	Prism.languages.insertBefore('aspnet', Prism.languages.javascript ? 'script' : 'tag', {
		'asp-script': {
			pattern: /(<script(?=.*runat=['"]?server\b)[^>]*>)[\s\S]*?(?=<\/script>)/i,
			lookbehind: true,
			alias: ['asp', 'script'],
			inside: Prism.languages.csharp || {}
		}
	});
}