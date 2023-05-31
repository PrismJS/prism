import { insertBefore } from '../shared/language-util';
import clike from './prism-clike';
import type { LanguageProto } from '../types';

export default {
	id: 'dart',
	require: clike,
	grammar({ extend }) {
		const keywords = [
			/\b(?:async|sync|yield)\*/,
			/\b(?:abstract|assert|async|await|break|case|catch|class|const|continue|covariant|default|deferred|do|dynamic|else|enum|export|extends|extension|external|factory|final|finally|for|get|hide|if|implements|import|in|interface|library|mixin|new|null|on|operator|part|rethrow|return|set|show|static|super|switch|sync|this|throw|try|typedef|var|void|while|with|yield)\b/
		];

		// Handles named imports, such as http.Client
		const packagePrefix = /(^|[^\w.])(?:[a-z]\w*\s*\.\s*)*(?:[A-Z]\w*\s*\.\s*)*/.source;

		// based on the dart naming conventions
		const className = {
			pattern: RegExp(packagePrefix + /[A-Z](?:[\d_A-Z]*[a-z]\w*)?\b/.source),
			lookbehind: true,
			inside: {
				'namespace': {
					pattern: /^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,
					inside: {
						'punctuation': /\./
					}
				},
			}
		};

		const dart = extend('clike', {
			'class-name': [
				className,
				{
					// variables and parameters
					// this to support class names (or generic parameters) which do not contain a lower case letter (also works for methods)
					pattern: RegExp(packagePrefix + /[A-Z]\w*(?=\s+\w+\s*[;,=()])/.source),
					lookbehind: true,
					inside: className.inside
				}
			],
			'keyword': keywords,
			'operator': /\bis!|\b(?:as|is)\b|\+\+|--|&&|\|\||<<=?|>>=?|~(?:\/=?)?|[+\-*\/%&^|=!<>]=?|\?/
		});

		insertBefore(dart, 'string', {
			'string-literal': {
				pattern: /r?(?:("""|''')[\s\S]*?\1|(["'])(?:\\.|(?!\2)[^\\\r\n])*\2(?!\2))/,
				greedy: true,
				inside: {
					'interpolation': {
						pattern: /((?:^|[^\\])(?:\\{2})*)\$(?:\w+|\{(?:[^{}]|\{[^{}]*\})*\})/,
						lookbehind: true,
						inside: {
							'punctuation': /^\$\{?|\}$/,
							'expression': {
								pattern: /[\s\S]+/,
								inside: 'dart'
							}
						}
					},
					'string': /[\s\S]+/
				}
			},
			'string': undefined
		});

		insertBefore(dart, 'class-name', {
			'metadata': {
				pattern: /@\w+/,
				alias: 'function'
			}
		});

		insertBefore(dart, 'class-name', {
			'generics': {
				pattern: /<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<[\w\s,.&?]*>)*>)*>)*>/,
				inside: {
					'class-name': className,
					'keyword': keywords,
					'punctuation': /[<>(),.:]/,
					'operator': /[?&|]/
				}
			},
		});

		return dart;
	}
} as LanguageProto<'dart'>;
