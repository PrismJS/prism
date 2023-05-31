import { insertBefore } from '../shared/language-util';
import { toArray } from '../shared/util';
import javascript from './prism-javascript';
import type { Grammar, LanguageProto } from '../types';

export default {
	id: 'typescript',
	require: javascript,
	alias: 'ts',
	grammar({ extend }) {
		const typeInside: Grammar = {};

		const typescript = extend('javascript', {
			'class-name': {
				pattern: /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
				lookbehind: true,
				greedy: true,
				inside: typeInside
			},
			'builtin': /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/,
		});

		typescript.keyword = [
			...toArray(typescript.keyword),

			// The keywords TypeScript adds to JavaScript
			/\b(?:abstract|declare|is|keyof|out|readonly|require|satisfies)\b/,
			// keywords that have to be followed by an identifier
			/\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
			// This is for `import type *, {}`
			/\btype\b(?=\s*(?:[\{*]|$))/
		];

		// doesn't work with TS because TS is too complex
		delete typescript['parameter'];
		delete typescript['literal-property'];

		// a version of typescript specifically for highlighting types
		Object.assign(typeInside, typescript);
		delete typeInside['class-name'];

		insertBefore(typescript, 'function', {
			'decorator': {
				pattern: /@[$\w\xA0-\uFFFF]+/,
				inside: {
					'at': {
						pattern: /^@/,
						alias: 'operator'
					},
					'function': /^[\s\S]+/
				}
			},
			'generic-function': {
				// e.g. foo<T extends "bar" | "baz">( ...
				pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
				greedy: true,
				inside: {
					'function': /^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,
					'generic': {
						pattern: /<[\s\S]+/, // everything after the first <
						alias: 'class-name',
						inside: typeInside
					}
				}
			}
		});

		return typescript;
	}
} as LanguageProto<'typescript'>;
