import { insertBefore } from '../shared/language-util';
import clike from './prism-clike';
import type { LanguageProto } from '../types';

export default {
	id: 'kotlin',
	require: clike,
	alias: ['kt', 'kts'],
	grammar({ extend }) {
		const kotlin = extend('clike', {
			'keyword': {
				// The lookbehind prevents wrong highlighting of e.g. kotlin.properties.get
				pattern: /(^|[^.])\b(?:abstract|actual|annotation|as|break|by|catch|class|companion|const|constructor|continue|crossinline|data|do|dynamic|else|enum|expect|external|final|finally|for|fun|get|if|import|in|infix|init|inline|inner|interface|internal|is|lateinit|noinline|null|object|open|operator|out|override|package|private|protected|public|reified|return|sealed|set|super|suspend|tailrec|this|throw|to|try|typealias|val|var|vararg|when|where|while)\b/,
				lookbehind: true
			},
			'function': [
				{
					pattern: /(?:`[^\r\n`]+`|\b\w+)(?=\s*\()/,
					greedy: true
				},
				{
					pattern: /(\.)(?:`[^\r\n`]+`|\w+)(?=\s*\{)/,
					lookbehind: true,
					greedy: true
				}
			],
			'number': /\b(?:0[xX][\da-fA-F]+(?:_[\da-fA-F]+)*|0[bB][01]+(?:_[01]+)*|\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?[fFL]?)\b/,
			'operator': /\+[+=]?|-[-=>]?|==?=?|!(?:!|==?)?|[\/*%<>]=?|[?:]:?|\.\.|&&|\|\||\b(?:and|inv|or|shl|shr|ushr|xor)\b/
		});

		delete kotlin['class-name'];

		const interpolationInside = {
			'interpolation-punctuation': {
				pattern: /^\$\{?|\}$/,
				alias: 'punctuation'
			},
			'expression': {
				pattern: /[\s\S]+/,
				inside: 'kotlin'
			}
		};

		insertBefore(kotlin, 'string', {
			// https://kotlinlang.org/spec/expressions.html#string-interpolation-expressions
			'string-literal': [
				{
					pattern: /"""(?:[^$]|\$(?:(?!\{)|\{[^{}]*\}))*?"""/,
					alias: 'multiline',
					inside: {
						'interpolation': {
							pattern: /\$(?:[a-z_]\w*|\{[^{}]*\})/i,
							inside: interpolationInside
						},
						'string': /[\s\S]+/
					}
				},
				{
					pattern: /"(?:[^"\\\r\n$]|\\.|\$(?:(?!\{)|\{[^{}]*\}))*"/,
					alias: 'singleline',
					inside: {
						'interpolation': {
							pattern: /((?:^|[^\\])(?:\\{2})*)\$(?:[a-z_]\w*|\{[^{}]*\})/i,
							lookbehind: true,
							inside: interpolationInside
						},
						'string': /[\s\S]+/
					}
				}
			],
			'char': {
				// https://kotlinlang.org/spec/expressions.html#character-literals
				pattern: /'(?:[^'\\\r\n]|\\(?:.|u[a-fA-F0-9]{0,4}))'/,
				greedy: true
			}
		});

		delete kotlin['string'];

		insertBefore(kotlin, 'keyword', {
			'annotation': {
				pattern: /\B@(?:\w+:)?(?:[A-Z]\w*|\[[^\]]+\])/,
				alias: 'builtin'
			}
		});

		insertBefore(kotlin, 'function', {
			'label': {
				pattern: /\b\w+@|@\w+\b/,
				alias: 'symbol'
			}
		});

		return kotlin;
	}
} as LanguageProto<'kotlin'>;
