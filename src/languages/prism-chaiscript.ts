import { insertBefore } from '../shared/language-util';
import { toArray } from '../shared/util';
import clike from './prism-clike';
import cpp from './prism-cpp';
import type { LanguageProto } from '../types';

export default {
	id: 'chaiscript',
	require: [clike, cpp],
	grammar({ extend, getLanguage }) {
		const cpp = getLanguage('cpp');

		const chaiscript = extend('clike', {
			'string': {
				pattern: /(^|[^\\])'(?:[^'\\]|\\[\s\S])*'/,
				lookbehind: true,
				greedy: true
			},
			'class-name': [
				{
					// e.g. class Rectangle { ... }
					pattern: /(\bclass\s+)\w+/,
					lookbehind: true
				},
				{
					// e.g. attr Rectangle::height, def Rectangle::area() { ... }
					pattern: /(\b(?:attr|def)\s+)\w+(?=\s*::)/,
					lookbehind: true
				}
			],
			'keyword': /\b(?:attr|auto|break|case|catch|class|continue|def|default|else|finally|for|fun|global|if|return|switch|this|try|var|while)\b/,
			'number': [
				...toArray(cpp.number),
				/\b(?:Infinity|NaN)\b/
			],
			'operator': />>=?|<<=?|\|\||&&|:[:=]?|--|\+\+|[=!<>+\-*/%|&^]=?|[?~]|`[^`\r\n]{1,4}`/,
		});

		insertBefore(chaiscript, 'operator', {
			'parameter-type': {
				// e.g. def foo(int x, Vector y) {...}
				pattern: /([,(]\s*)\w+(?=\s+\w)/,
				lookbehind: true,
				alias: 'class-name'
			},
		});

		insertBefore(chaiscript, 'string', {
			'string-interpolation': {
				pattern: /(^|[^\\])"(?:[^"$\\]|\\[\s\S]|\$(?!\{)|\$\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\})*"/,
				lookbehind: true,
				greedy: true,
				inside: {
					'interpolation': {
						pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}/,
						lookbehind: true,
						inside: {
							'interpolation-expression': {
								pattern: /(^\$\{)[\s\S]+(?=\}$)/,
								lookbehind: true,
								inside: 'chaiscript'
							},
							'interpolation-punctuation': {
								pattern: /^\$\{|\}$/,
								alias: 'punctuation'
							}
						}
					},
					'string': /[\s\S]+/
				}
			},
		});

		return chaiscript;
	}
} as LanguageProto<'chaiscript'>;
