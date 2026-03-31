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
				$rest: 'csharp',
			},
		});

		return {
			'page-directive': {
				pattern: /<%\s*@.*%>/,
				alias: 'tag',
				inside: {
					'page-directive': {
						pattern:
							/<%\s*@\s*(?:Assembly|Control|Implements|Import|Master(?:Type)?|OutputCache|Page|PreviousPageType|Reference|Register)?|%>/i,
						alias: 'tag',
					},
					$rest: /** @type {GrammarToken} */ (base['tag']).inside,
				},
			},
			'directive': directive,
			$merge: {
				'tag': {
					// Regexp copied from markup, with a negative look-ahead added
					pattern:
						/<(?!%)\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/,
				},
			},
			$insertBefore: {
				'tag/attr-value/punctuation': {
					// match directives of attribute value foo="<% Bar %>"
					'directive': directive,
				},
				'comment': {
					'asp-comment': {
						pattern: /<%--[\s\S]*?--%>/,
						alias: ['asp', 'comment'],
					},
				},
				// script runat="server" contains csharp, not javascript
				['script' in base ? 'script' : 'tag']: {
					'asp-script': {
						pattern: /(<script(?=.*runat=['"]?server\b)[^>]*>)[\s\S]*?(?=<\/script>)/i,
						lookbehind: true,
						alias: ['asp', 'script'],
						inside: 'csharp',
					},
				},
			},
		};
	},
};

/**
 * @typedef {import('../types.d.ts').GrammarToken} GrammarToken
 */
