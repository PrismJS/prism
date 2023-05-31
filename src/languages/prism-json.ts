import type { LanguageProto } from '../types';

export default {
	id: 'json',
	alias: 'webmanifest',
	grammar() {
		// https://www.json.org/json-en.html
		return {
			'property': {
				pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
				lookbehind: true,
				greedy: true
			},
			'string': {
				pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
				lookbehind: true,
				greedy: true
			},
			'comment': {
				pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
				greedy: true
			},
			'number': /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
			'punctuation': /[{}[\],]/,
			'operator': /:/,
			'boolean': /\b(?:false|true)\b/,
			'null': {
				pattern: /\bnull\b/,
				alias: 'keyword'
			}
		};
	}
} as LanguageProto<'json'>;
