import { insertBefore } from '../shared/language-util';
import { rest } from '../shared/symbols';
import type { LanguageProto } from '../types';

export default {
	id: 'rescript',
	alias: 'res',
	grammar() {
		const rescript = {
			'comment': {
				pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
				greedy: true
			},
			'char': { pattern: /'(?:[^\r\n\\]|\\(?:.|\w+))'/, greedy: true },
			'string': {
				pattern: /"(?:\\(?:\r\n|[\s\S])|[^\\\r\n"])*"/,
				greedy: true
			},
			'class-name': /\b[A-Z]\w*|@[a-z.]*|#[A-Za-z]\w*|#\d/,
			'function': {
				pattern: /[a-zA-Z]\w*(?=\()|(\.)[a-z]\w*/,
				lookbehind: true,
			},
			'number': /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
			'boolean': /\b(?:false|true)\b/,
			'attr-value': /[A-Za-z]\w*(?==)/,
			'constant': {
				pattern: /(\btype\s+)[a-z]\w*/,
				lookbehind: true
			},
			'tag': {
				pattern: /(<)[a-z]\w*|(?:<\/)[a-z]\w*/,
				lookbehind: true,
				inside: {
					'operator': /<|>|\//,
				},
			},
			'keyword': /\b(?:and|as|assert|begin|bool|class|constraint|do|done|downto|else|end|exception|external|float|for|fun|function|if|in|include|inherit|initializer|int|lazy|let|method|module|mutable|new|nonrec|object|of|open|or|private|rec|string|switch|then|to|try|type|when|while|with)\b/,
			'operator': /\.{3}|:[:=]?|\|>|->|=(?:==?|>)?|<=?|>=?|[|^?'#!~`]|[+\-*\/]\.?|\b(?:asr|land|lor|lsl|lsr|lxor|mod)\b/,
			'punctuation': /[(){}[\],;.]/
		};

		insertBefore(rescript, 'string', {
			'template-string': {
				pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
				greedy: true,
				inside: {
					'template-punctuation': {
						pattern: /^`|`$/,
						alias: 'string'
					},
					'interpolation': {
						pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
						lookbehind: true,
						inside: {
							'interpolation-punctuation': {
								pattern: /^\$\{|\}$/,
								alias: 'tag'
							},
							[rest]: 'rescript'
						}
					},
					'string': /[\s\S]+/
				}
			},
		});

		return rescript;
	}
} as LanguageProto<'rescript'>;
