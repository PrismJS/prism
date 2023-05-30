import { embeddedIn } from '../shared/languages/templating';
import { tokenize } from '../shared/symbols';
import markup from './prism-markup';
import type { GrammarToken, LanguageProto } from '../types';

export default {
	id: 'smarty',
	require: markup,
	grammar() {
		const expression = {
			pattern: /[\s\S]+/,
			inside: null as GrammarToken['inside']
		};

		const smarty = {
			'string': [
				{
					pattern: /"(?:\\.|[^"\\\r\n])*"/,
					greedy: true,
					inside: {
						'interpolation': {
							pattern: /\{[^{}]*\}|`[^`]*`/,
							inside: {
								'interpolation-punctuation': {
									pattern: /^[{`]|[`}]$/,
									alias: 'punctuation'
								},
								'expression': expression
							}
						},
						'variable': /\$\w+/
					}
				},
				{
					pattern: /'(?:\\.|[^'\\\r\n])*'/,
					greedy: true
				},
			],
			'keyword': {
				pattern: /(^\{\/?)[a-z_]\w*\b(?!\()/i,
				lookbehind: true,
				greedy: true
			},
			'delimiter': {
				pattern: /^\{\/?|\}$/,
				greedy: true,
				alias: 'punctuation'
			},
			'number': /\b0x[\dA-Fa-f]+|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee][-+]?\d+)?/,
			'variable': [
				/\$(?!\d)\w+/,
				/#(?!\d)\w+#/,
				{
					pattern: /(\.|->|\w\s*=)(?!\d)\w+\b(?!\()/,
					lookbehind: true
				},
				{
					pattern: /(\[)(?!\d)\w+(?=\])/,
					lookbehind: true
				}
			],
			'function': {
				pattern: /(\|\s*)@?[a-z_]\w*|\b[a-z_]\w*(?=\()/i,
				lookbehind: true
			},
			'attr-name': /\b[a-z_]\w*(?=\s*=)/i,
			'boolean': /\b(?:false|no|off|on|true|yes)\b/,
			'punctuation': /[\[\](){}.,:`]|->/,
			'operator': [
				/[+\-*\/%]|==?=?|[!<>]=?|&&|\|\|?/,
				/\bis\s+(?:not\s+)?(?:div|even|odd)(?:\s+by)?\b/,
				/\b(?:and|eq|gt?e|gt|lt?e|lt|mod|neq?|not|or)\b/
			]
		};

		expression.inside = smarty;

		const string = /"(?:\\.|[^"\\\r\n])*"|'(?:\\.|[^'\\\r\n])*'/;
		const smartyPattern = RegExp(
			/\{(?:[^{}"']|<str>|\{(?:[^{}"']|<str>|\{(?:[^{}"']|<str>)*\})*\})*\}/.source
				.replace(/<str>/g, () => string.source)
		);

		return {
			'ignore-literal': {
				pattern: /(\{literal\})[\s\S]*?(?=\{\/literal\})/,
				lookbehind: true,
				greedy: true
			},
			'embedded-php': {
				pattern: /(\{php\})[\s\S]*?(?=\{\/php\})/,
				lookbehind: true,
				greedy: true,
				alias: ['php', 'language-php'],
				inside: 'php'
			},
			'smarty-comment': {
				pattern: /\{\*[\s\S]*?\*\}/,
				greedy: true,
				alias: 'comment'
			},
			'smarty': {
				pattern: smartyPattern,
				greedy: true,
				inside: smarty
			},
			[tokenize]: embeddedIn('markup')
		};
	}
} as LanguageProto<'smarty'>;
