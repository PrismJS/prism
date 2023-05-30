import { insertBefore } from '../shared/language-util';
import clike from './prism-clike';
import type { LanguageProto } from '../types';

export default {
	id: 'cfscript',
	require: clike,
	alias: 'cfc',
	grammar({ extend }) {
		// https://cfdocs.org/script
		const cfscript = extend('clike', {
			'comment': [
				{
					pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
					lookbehind: true,
					inside: {
						'annotation': {
							pattern: /(?:^|[^.])@[\w\.]+/,
							alias: 'punctuation'
						}
					}
				},
				{
					pattern: /(^|[^\\:])\/\/.*/,
					lookbehind: true,
					greedy: true
				}
			],
			'keyword': /\b(?:abstract|break|catch|component|continue|default|do|else|extends|final|finally|for|function|if|in|include|package|private|property|public|remote|required|rethrow|return|static|switch|throw|try|var|while|xml)\b(?!\s*=)/,
			'operator': [
				/\+\+|--|&&|\|\||::|=>|[!=]==|[-+*/%&|^!=<>]=?|\?(?:\.|:)?|:/,
				/\b(?:and|contains|eq|equal|eqv|gt|gte|imp|is|lt|lte|mod|not|or|xor)\b/
			],
			'scope': {
				pattern: /\b(?:application|arguments|cgi|client|cookie|local|session|super|this|variables)\b/,
				alias: 'global'
			},
			'type': {
				pattern: /\b(?:any|array|binary|boolean|date|guid|numeric|query|string|struct|uuid|void|xml)\b/,
				alias: 'builtin'
			}
		});

		insertBefore(cfscript, 'keyword', {
			// This must be declared before keyword because we use "function" inside the lookahead
			'function-variable': {
				pattern: /[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
				alias: 'function'
			}
		});

		delete cfscript['class-name'];

		return cfscript;
	}
} as LanguageProto<'cfscript'>;
