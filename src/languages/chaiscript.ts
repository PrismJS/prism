import { toArray } from '../util/iterables';
import clike from './clike';
import cpp from './cpp';
import type { Grammar, GrammarOptions, LanguageProto } from '../types';

export default {
	id: 'chaiscript',
	require: cpp,
	base: clike,
	grammar ({ languages }: GrammarOptions): Grammar {
		return {
			'string': {
				pattern: /(^|[^\\])'(?:[^'\\]|\\[\s\S])*'/,
				lookbehind: true,
				greedy: true,
			},
			'class-name': [
				{
					// e.g. class Rectangle { ... }
					pattern: /(\bclass\s+)\w+/,
					lookbehind: true,
				},
				{
					// e.g. attr Rectangle::height, def Rectangle::area() { ... }
					pattern: /(\b(?:attr|def)\s+)\w+(?=\s*::)/,
					lookbehind: true,
				},
			],
			'keyword':
				/\b(?:attr|auto|break|case|catch|class|continue|def|default|else|finally|for|fun|global|if|return|switch|this|try|var|while)\b/,
			'number': [...toArray(languages.cpp.number), /\b(?:Infinity|NaN)\b/],
			'operator': />>=?|<<=?|\|\||&&|:[:=]?|--|\+\+|[=!<>+\-*/%|&^]=?|[?~]|`[^`\r\n]{1,4}`/,
			$insertBefore: {
				'operator': {
					'parameter-type': {
						// e.g. def foo(int x, Vector y) {...}
						pattern: /([,(]\s*)\w+(?=\s+\w)/,
						lookbehind: true,
						alias: 'class-name',
					},
				},
				'string': {
					'string-interpolation': {
						pattern:
							/(^|[^\\])"(?:[^"$\\]|\\[\s\S]|\$(?!\{)|\$\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\})*"/,
						lookbehind: true,
						greedy: true,
						inside: {
							'interpolation': {
								pattern:
									/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}/,
								lookbehind: true,
								inside: {
									'interpolation-expression': {
										pattern: /(^\$\{)[\s\S]+(?=\}$)/,
										lookbehind: true,
										inside: 'chaiscript',
									},
									'interpolation-punctuation': {
										pattern: /^\$\{|\}$/,
										alias: 'punctuation',
									},
								},
							},
							'string': /[\s\S]+/,
						},
					},
				},
			},
		};
	},
} as LanguageProto<'chaiscript'>;
