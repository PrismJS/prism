import type { LanguageProto } from '../types';

export default {
	id: 'jq',
	grammar() {
		const interpolation = /\\\((?:[^()]|\([^()]*\))*\)/.source;
		const string = RegExp(/(^|[^\\])"(?:[^"\r\n\\]|\\[^\r\n(]|__)*"/.source.replace(/__/g, () => interpolation));
		const stringInterpolation = {
			'interpolation': {
				pattern: RegExp(/((?:^|[^\\])(?:\\{2})*)/.source + interpolation),
				lookbehind: true,
				inside: {
					'content': {
						pattern: /^(\\\()[\s\S]+(?=\)$)/,
						lookbehind: true,
						inside: 'jq'
					},
					'punctuation': /^\\\(|\)$/
				}
			}
		};

		return {
			'comment': /#.*/,
			'property': {
				pattern: RegExp(string.source + /(?=\s*:(?!:))/.source),
				lookbehind: true,
				greedy: true,
				inside: stringInterpolation
			},
			'string': {
				pattern: string,
				lookbehind: true,
				greedy: true,
				inside: stringInterpolation
			},

			'function': {
				pattern: /(\bdef\s+)[a-z_]\w+/i,
				lookbehind: true
			},

			'variable': /\B\$\w+/,
			'property-literal': {
				pattern: /\b[a-z_]\w*(?=\s*:(?!:))/i,
				alias: 'property'
			},
			'keyword': /\b(?:as|break|catch|def|elif|else|end|foreach|if|import|include|label|module|modulemeta|null|reduce|then|try|while)\b/,
			'boolean': /\b(?:false|true)\b/,
			'number': /(?:\b\d+\.|\B\.)?\b\d+(?:[eE][+-]?\d+)?\b/,

			'operator': [
				{
					pattern: /\|=?/,
					alias: 'pipe'
				},
				/\.\.|[!=<>]?=|\?\/\/|\/\/=?|[-+*/%]=?|[<>?]|\b(?:and|not|or)\b/
			],
			'c-style-function': {
				pattern: /\b[a-z_]\w*(?=\s*\()/i,
				alias: 'function'
			},
			'punctuation': /::|[()\[\]{},:;]|\.(?=\s*[\[\w$])/,
			'dot': {
				pattern: /\./,
				alias: 'important'
			}
		};
	}
} as LanguageProto<'jq'>;
