import { insertBefore } from '../util/language-util';
import csharp from './csharp';
import markup from './markup';
import type { Grammar, GrammarToken, LanguageProto } from '../types';

export default {
	id: 'aspnet',
	base: markup,
	require: csharp,
	grammar ({ base }) {
		const directive = {
			pattern: /<%.*%>/,
			alias: 'tag',
			inside: {
				'directive': {
					pattern: /<%\s*?[$=%#:]{0,2}|%>/,
					alias: 'tag',
				},
				$rest: 'csharp',
			},
		} as unknown as GrammarToken;

		const tag = base['tag'] as GrammarToken & {
			inside: { 'attr-value': { inside: Grammar } };
		};

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
					$rest: tag.inside as Grammar['$rest'],
				},
			},
			'directive': directive,
		};
	},
} as LanguageProto<'aspnet'>;
