import clike from './clike';
import type { Grammar, LanguageProto } from '../types';

export default {
	id: 'go',
	base: clike,
	grammar () {
		return {
			'string': {
				pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"|`[^`]*`/,
				lookbehind: true,
				greedy: true,
			},
			'keyword':
				/\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(?:to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,
			'boolean': /\b(?:_|false|iota|nil|true)\b/,
			'number': [
				// binary and octal integers
				/\b0(?:b[01_]+|o[0-7_]+)i?\b/i,
				// hexadecimal integers and floats
				/\b0x(?:[a-f\d_]+(?:\.[a-f\d_]*)?|\.[a-f\d_]+)(?:p[+-]?\d+(?:_\d+)*)?i?(?!\w)/i,
				// decimal integers and floats
				/(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?[\d_]+)?i?(?!\w)/i,
			],
			'operator':
				/[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
			'builtin':
				/\b(?:append|bool|byte|cap|close|complex|complex(?:64|128)|copy|delete|error|float(?:32|64)|imag|u?int(?:8|16|32|64)?|len|make|new|panic|print(?:ln)?|real|recover|rune|string|uintptr)\b/,
			$insert: {
				'char': {
					$before: 'string',
					pattern: /'(?:\\.|[^'\\\r\n]){0,10}'/,
					greedy: true,
				},
			},
			$delete: ['class-name'],
		} as unknown as Grammar;
	},
} as LanguageProto<'go'>;
