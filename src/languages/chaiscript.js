import { toArray } from '../util/iterables.js';
import clike from './clike.js';
import cpp from './cpp.js';

/** @type {import('../types.d.ts').LanguageProto<'chaiscript'>} */
export default {
	id: 'chaiscript',
	base: clike,
	require: cpp,
	grammar ({ languages }) {
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
			'number': [
				...toArray(
					/** @type {import('../types.d.ts').GrammarTokens} */ (languages.cpp).number
				),
				/\b(?:Infinity|NaN)\b/,
			],
			'operator': />>=?|<<=?|\|\||&&|:[:=]?|--|\+\+|[=!<>+\-*/%|&^]=?|[?~]|`[^`\r\n]{1,4}`/,
			$insert: {
				'parameter-type': {
					$before: 'operator',
					// e.g. def foo(int x, Vector y) {...}
					pattern: /([,(]\s*)\w+(?=\s+\w)/,
					lookbehind: true,
					alias: 'class-name',
				},
				'string-interpolation': {
					$before: 'string',
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
		};
	},
};
