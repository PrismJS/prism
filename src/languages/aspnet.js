import { insertBefore } from '../util/language-util.js';
import csharp from './csharp.js';
import markup from './markup.js';

/** @type {import('../types.d.ts').LanguageProto<'aspnet'>} */
export default {
	id: 'aspnet',
	base: markup,
	require: csharp,
	grammar ({ base }) {
		const directive = /** @type {GrammarToken} */ ({
			pattern: /<%.*%>/,
			alias: 'tag',
			inside: {
				'directive': {
					pattern: /<%\s*?[$=%#:]{0,2}|%>/,
					alias: 'tag',
				},
				$rest: /** @type {Grammar['$rest']} */ ('csharp'),
			},
		});

		const tag =
			/** @type {GrammarToken & { inside: { 'attr-value': { inside: Grammar } } }} */ (
				base['tag']
			);

		// Regexp copied from markup, with a negative look-ahead added
		tag.pattern =
			/<(?!%)\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/;

		// match directives of attribute value foo="<% Bar %>"
		insertBefore(tag.inside['attr-value'].inside, 'punctuation', {
			'directive': directive,
		});

		insertBefore(base, 'comment', {
			'asp-comment': {
				pattern: /<%--[\s\S]*?--%>/,
				alias: ['asp', 'comment'],
			},
		});

		// script runat="server" contains csharp, not javascript
		insertBefore(base, 'script' in base ? 'script' : 'tag', {
			'asp-script': {
				pattern: /(<script(?=.*runat=['"]?server\b)[^>]*>)[\s\S]*?(?=<\/script>)/i,
				lookbehind: true,
				alias: ['asp', 'script'],
				inside: 'csharp',
			},
		});

		return /** @type {Grammar} */ ({
			'page-directive': {
				pattern: /<%\s*@.*%>/,
				alias: 'tag',
				inside: {
					'page-directive': {
						pattern:
							/<%\s*@\s*(?:Assembly|Control|Implements|Import|Master(?:Type)?|OutputCache|Page|PreviousPageType|Reference|Register)?|%>/i,
						alias: 'tag',
					},
					$rest: /** @type {Grammar['$rest']} */ (tag.inside),
				},
			},
			'directive': directive,
		});
	},
};

/**
 * @typedef {import('../types.d.ts').Grammar} Grammar
 * @typedef {import('../types.d.ts').GrammarToken} GrammarToken
 */
