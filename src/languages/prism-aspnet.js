import markup from './prism-markup.js';
import csharp from './prism-csharp.js';
import { rest } from '../shared/symbols.js';
import { insertBefore } from '../shared/language-util.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'aspnet',
	require: [markup, csharp],
	grammar({ extend, getLanguage }) {
		const markup = getLanguage('markup');

		const aspnet = extend('markup', {
			'page-directive': {
				pattern: /<%\s*@.*%>/,
				alias: 'tag',
				inside: {
					'page-directive': {
						pattern: /<%\s*@\s*(?:Assembly|Control|Implements|Import|Master(?:Type)?|OutputCache|Page|PreviousPageType|Reference|Register)?|%>/i,
						alias: 'tag'
					},
					[rest]: markup.tag.inside
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
					[rest]: 'csharp'
				}
			}
		});
		// Regexp copied from prism-markup, with a negative look-ahead added
		aspnet.tag.pattern = /<(?!%)\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/;

		// match directives of attribute value foo="<% Bar %>"
		insertBefore(aspnet.tag.inside['attr-value'].inside, 'punctuation', {
			'directive': aspnet['directive']
		});

		insertBefore(aspnet, 'comment', {
			'asp-comment': {
				pattern: /<%--[\s\S]*?--%>/,
				alias: ['asp', 'comment']
			}
		});

		// script runat="server" contains csharp, not javascript
		insertBefore(aspnet, 'script' in markup ? 'script' : 'tag', {
			'asp-script': {
				pattern: /(<script(?=.*runat=['"]?server\b)[^>]*>)[\s\S]*?(?=<\/script>)/i,
				lookbehind: true,
				alias: ['asp', 'script'],
				inside: 'csharp'
			}
		});

		return aspnet;
	}
});
