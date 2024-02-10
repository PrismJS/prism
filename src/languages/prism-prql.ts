import { rest } from '../shared/symbols';
import type { LanguageProto } from '../types';

export default {
	id: 'prql',
	grammar: {
		'doc-comment': {
			pattern: /(^|[^\\])#!.*/,
			lookbehind: true,
			greedy: true
		},
		'comment': {
			pattern: /(^|[^\\])#.*/,
			lookbehind: true,
			greedy: true
		},
		'string-interpolation': {
			pattern: /(?:[frs])(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
			greedy: true,
			inside: {
				'interpolation': {
					pattern: /((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,
					lookbehind: true,
					inside: {
						'format-spec': {
							pattern: /(:)[^:(){}]+(?=\}$)/,
							lookbehind: true
						},
						[rest]: 'prql'
					}
				},
				'string': /[\s\S]+/
			}
		},
		'triple-quoted-string': {
			pattern: /(?:[frs]?("""|''')[\s\S]*?\1/i,
			greedy: true,
			alias: 'string'
		},
		'string': {
			pattern: /(?:[frs])?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
			greedy: true
		},
		'keyword': /\b(?:_(?=\s*:)aggregate|derive|filter|from|group|join|select|sort|take|window|let|into|case|prql|type|module|internal)\b/,
		'builtin': /\b(?:min|max|sum|average|stddev|every|any|concat_array|count|lag|lead|first|last|rank|rank_dense|row_number|round|as|in|tuple_every|tuple_map|tuple_zip|_eq|_is_null|from_text|lower|upper|read_parquet|read_csv)\b/,
		'boolean': /\b(?:false|null|true)\b/,
		'number': /\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,
		'operator': /[-+%=]=?|!=|~=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
		'punctuation': /[{}[\](),.:]/
	}
} as LanguageProto<'prql'>;
