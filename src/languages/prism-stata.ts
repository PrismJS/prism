import java from './prism-java';
import mata from './prism-mata';
import python from './prism-python';
import type { LanguageProto } from '../types';

export default {
	id: 'stata',
	require: [mata, java, python],
	grammar() {
		// https://www.stata.com/manuals/u.pdf
		// https://www.stata.com/manuals/p.pdf

		return {
			'comment': [
				{
					pattern: /(^[ \t]*)\*.*/m,
					lookbehind: true,
					greedy: true
				},
				{
					pattern: /(^|\s)\/\/.*|\/\*[\s\S]*?\*\//,
					lookbehind: true,
					greedy: true
				}
			],
			'string-literal': {
				pattern: /"[^"\r\n]*"|[‘`']".*?"[’`']/,
				greedy: true,
				inside: {
					'interpolation': {
						pattern: /\$\{[^{}]*\}|[‘`']\w[^’`'\r\n]*[’`']/,
						inside: {
							'punctuation': /^\$\{|\}$/,
							'expression': {
								pattern: /[\s\S]+/,
								inside: 'stata'
							}
						}
					},
					'string': /[\s\S]+/
				}
			},

			'mata': {
				pattern: /(^[ \t]*mata[ \t]*:)[\s\S]+?(?=^end\b)/m,
				lookbehind: true,
				greedy: true,
				alias: 'language-mata',
				inside: 'mata'
			},
			'java': {
				pattern: /(^[ \t]*java[ \t]*:)[\s\S]+?(?=^end\b)/m,
				lookbehind: true,
				greedy: true,
				alias: 'language-java',
				inside: 'java'
			},
			'python': {
				pattern: /(^[ \t]*python[ \t]*:)[\s\S]+?(?=^end\b)/m,
				lookbehind: true,
				greedy: true,
				alias: 'language-python',
				inside: 'python'
			},


			'command': {
				pattern: /(^[ \t]*(?:\.[ \t]+)?(?:(?:bayes|bootstrap|by|bysort|capture|collect|fmm|fp|frame|jackknife|mfp|mi|nestreg|noisily|permute|quietly|rolling|simulate|statsby|stepwise|svy|version|xi)\b[^:\r\n]*:[ \t]*|(?:capture|noisily|quietly|version)[ \t]+)?)[a-zA-Z]\w*/m,
				lookbehind: true,
				greedy: true,
				alias: 'keyword'
			},
			'variable': /\$\w+|[‘`']\w[^’`'\r\n]*[’`']/,
			'keyword': /\b(?:bayes|bootstrap|by|bysort|capture|clear|collect|fmm|fp|frame|if|in|jackknife|mi[ \t]+estimate|mfp|nestreg|noisily|of|permute|quietly|rolling|simulate|sort|statsby|stepwise|svy|varlist|version|xi)\b/,


			'boolean': /\b(?:off|on)\b/,
			'number': /\b\d+(?:\.\d+)?\b|\B\.\d+/,
			'function': /\b[a-z_]\w*(?=\()/i,

			'operator': /\+\+|--|##?|[<>!=~]=?|[+\-*^&|/]/,
			'punctuation': /[(){}[\],:]/
		};
	}
} as LanguageProto<'stata'>;
