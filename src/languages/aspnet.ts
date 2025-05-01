import csharp from './csharp';
import markup from './markup';
import type { Grammar, LanguageProto } from '../types';

export default {
	id: 'aspnet',
	require: csharp,
	base: markup,
	grammar (): Grammar {
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
					$rest: self['tag'].inside,
				},
			},
			'directive': {
				pattern: /<%.*%>/,
				alias: 'tag',
				inside: {
					'directive': {
						pattern: /<%\s*?[$=%#:]{0,2}|%>/,
						alias: 'tag',
					},
					$rest: 'csharp',
				},
			},
			$merge: {
				'tag': {
					// Regexp copied from markup, with a negative look-ahead added
					pattern:
						/<(?!%)\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/,
					inside: {
						'attr-value': {
							inside: {
								$insertBefore: {
									'punctuation': {
										// match directives of attribute value foo="<% Bar %>"
										'directive': self['directive'],
									},
								},
							},
						},
					},
				},
			},
			$insertBefore: {
				'comment': {
					'asp-comment': {
						pattern: /<%--[\s\S]*?--%>/,
						alias: ['asp', 'comment'],
					},
				},
				// script runat="server" contains csharp, not javascript
				['script' in self ? 'script' : 'tag']: {
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
} as LanguageProto<'aspnet'>;
