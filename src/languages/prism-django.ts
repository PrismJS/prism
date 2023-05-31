import { embeddedIn } from '../shared/languages/templating';
import { tokenize } from '../shared/symbols';
import markup from './prism-markup';
import type { LanguageProto } from '../types';

// Django/Jinja2 syntax definition for Prism.js <http://prismjs.com> syntax highlighter.
// Mostly it works OK but can paint code incorrectly on complex html/template tag combinations.

export default {
	id: 'django',
	require: markup,
	alias: 'jinja2',
	grammar: {
		'django': {
			pattern: /\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}|\{#[\s\S]*?#\}/,
			inside: {
				'comment': /^\{#[\s\S]*?#\}$/,
				'tag': {
					pattern: /(^\{%[+-]?\s*)\w+/,
					lookbehind: true,
					alias: 'keyword'
				},
				'delimiter': {
					pattern: /^\{[{%][+-]?|[+-]?[}%]\}$/,
					alias: 'punctuation'
				},
				'string': {
					pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
					greedy: true
				},
				'filter': {
					pattern: /(\|)\w+/,
					lookbehind: true,
					alias: 'function'
				},
				'test': {
					pattern: /(\bis\s+(?:not\s+)?)(?!not\b)\w+/,
					lookbehind: true,
					alias: 'function'
				},
				'function': /\b[a-z_]\w+(?=\s*\()/i,
				'keyword': /\b(?:and|as|by|else|for|if|import|in|is|loop|not|or|recursive|with|without)\b/,
				'operator': /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
				'number': /\b\d+(?:\.\d+)?\b/,
				'boolean': /[Ff]alse|[Nn]one|[Tt]rue/,
				'variable': /\b\w+\b/,
				'punctuation': /[{}[\](),.:;]/
			}
		},
		[tokenize]: embeddedIn('markup')
	}
} as LanguageProto<'django'>;
