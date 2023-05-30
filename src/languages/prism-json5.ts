import json from './prism-json';
import type { LanguageProto } from '../types';

export default {
	id: 'json5',
	require: json,
	grammar({ extend }) {
		const string = /("|')(?:\\(?:\r\n?|\n|.)|(?!\1)[^\\\r\n])*\1/;

		return extend('json', {
			'property': [
				{
					pattern: RegExp(string.source + '(?=\\s*:)'),
					greedy: true
				},
				{
					pattern: /(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/,
					alias: 'unquoted'
				}
			],
			'string': {
				pattern: string,
				greedy: true
			},
			'number': /[+-]?\b(?:NaN|Infinity|0x[a-fA-F\d]+)\b|[+-]?(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[eE][+-]?\d+\b)?/
		});
	}
} as LanguageProto<'json5'>;
