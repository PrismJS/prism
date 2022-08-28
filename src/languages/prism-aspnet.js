import { insertBefore } from '../shared/language-util';
import { rest } from '../shared/symbols';
import csharp from './prism-csharp';
import markup from './prism-markup';

export default /** @type {import("../types").LanguageProto<'aspnet'>} */ ({
	id: 'aspnet',
	require: [markup, csharp],
	grammar({ extend }) {
		/** @type {import('../types').Grammar} */
		const pageDirectiveInside = {
			'page-directive': {
				pattern: /<%\s*@\s*(?:Assembly|Control|Implements|Import|Master(?:Type)?|OutputCache|Page|PreviousPageType|Reference|Register)?|%>/i,
				alias: 'tag'
			},
		};

		const aspnet = extend('markup', {
			'page-directive': {
				pattern: /<%\s*@.*%>/,
				alias: 'tag',
				inside: pageDirectiveInside
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

		const tag = /** @type {import('../types').GrammarToken & { inside: { 'attr-value': { inside: import('../types').Grammar } } }} */ (aspnet['tag']);
		pageDirectiveInside[rest] = tag.inside;

		// Regexp copied from prism-markup, with a negative look-ahead added
		tag.pattern = /<(?!%)\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/;

		// match directives of attribute value foo="<% Bar %>"
		insertBefore(tag.inside['attr-value'].inside, 'punctuation', {
			'directive': aspnet['directive']
		});

		insertBefore(aspnet, 'comment', {
			'asp-comment': {
				pattern: /<%--[\s\S]*?--%>/,
				alias: ['asp', 'comment']
			}
		});

		// script runat="server" contains csharp, not javascript
		insertBefore(aspnet, 'script' in aspnet ? 'script' : 'tag', {
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
