import { insertBefore } from '../shared/language-util';
import { rest } from '../shared/symbols';
import clike from './prism-clike';
import type { LanguageProto } from '../types';

export default {
	id: 'vala',
	require: clike,
	grammar({ extend }) {
		const vala = extend('clike', {
			// Classes copied from prism-csharp
			'class-name': [
				{
					// (Foo bar, Bar baz)
					pattern: /\b[A-Z]\w*(?:\.\w+)*\b(?=(?:\?\s+|\*?\s+\*?)\w)/,
					inside: {
						punctuation: /\./
					}
				},
				{
					// [Foo]
					pattern: /(\[)[A-Z]\w*(?:\.\w+)*\b/,
					lookbehind: true,
					inside: {
						punctuation: /\./
					}
				},
				{
					// class Foo : Bar
					pattern: /(\b(?:class|interface)\s+[A-Z]\w*(?:\.\w+)*\s*:\s*)[A-Z]\w*(?:\.\w+)*\b/,
					lookbehind: true,
					inside: {
						punctuation: /\./
					}
				},
				{
					// class Foo
					pattern: /((?:\b(?:class|enum|interface|new|struct)\s+)|(?:catch\s+\())[A-Z]\w*(?:\.\w+)*\b/,
					lookbehind: true,
					inside: {
						punctuation: /\./
					}
				}
			],
			'keyword': /\b(?:abstract|as|assert|async|base|bool|break|case|catch|char|class|const|construct|continue|default|delegate|delete|do|double|dynamic|else|ensures|enum|errordomain|extern|finally|float|for|foreach|get|if|in|inline|int|int16|int32|int64|int8|interface|internal|is|lock|long|namespace|new|null|out|override|owned|params|private|protected|public|ref|requires|return|set|short|signal|sizeof|size_t|ssize_t|static|string|struct|switch|this|throw|throws|try|typeof|uchar|uint|uint16|uint32|uint64|uint8|ulong|unichar|unowned|ushort|using|value|var|virtual|void|volatile|weak|while|yield)\b/i,
			'function': /\b\w+(?=\s*\()/,
			'number': /(?:\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)(?:f|u?l?)?/i,
			'operator': /\+\+|--|&&|\|\||<<=?|>>=?|=>|->|~|[+\-*\/%&^|=!<>]=?|\?\??|\.\.\./,
			'punctuation': /[{}[\];(),.:]/,
			'constant': /\b[A-Z0-9_]+\b/
		});

		insertBefore(vala, 'string', {
			'raw-string': {
				pattern: /"""[\s\S]*?"""/,
				greedy: true,
				alias: 'string'
			},
			'template-string': {
				pattern: /@"[\s\S]*?"/,
				greedy: true,
				inside: {
					'interpolation': {
						pattern: /\$(?:\([^)]*\)|[a-zA-Z]\w*)/,
						inside: {
							'delimiter': {
								pattern: /^\$\(?|\)$/,
								alias: 'punctuation'
							},
							[rest]: vala
						}
					},
					'string': /[\s\S]+/
				}
			}
		});

		insertBefore(vala, 'keyword', {
			'regex': {
				pattern: /\/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[imsx]{0,4}(?=\s*(?:$|[\r\n,.;})\]]))/,
				greedy: true,
				inside: {
					'regex-source': {
						pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
						lookbehind: true,
						alias: 'language-regex',
						inside: 'regex'
					},
					'regex-delimiter': /^\//,
					'regex-flags': /^[a-z]+$/,
				}
			}
		});

		return vala;
	}
} as LanguageProto<'vala'>;
