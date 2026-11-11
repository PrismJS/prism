/** @type {import('../types.d.ts').LanguageProto<'prql'>} */
export default {
	id: 'prql',
	grammar () {
		const time = /\d{2}(?::\d{2}(?::\d{2})?)?(?:\.\d{1,6})?(?:Z|[+-]\d{2}:?\d{2})?/.source;

		// Based on the PRQL lexer: https://github.com/PRQL/prql/blob/main/prqlc/prqlc-parser/src/lexer/mod.rs
		return {
			'doc-comment': {
				pattern: /#!.*/,
				greedy: true,
				alias: 'comment',
			},
			'comment': {
				pattern: /#.*/,
				greedy: true,
			},
			'string-interpolation': {
				// f-strings and s-strings
				pattern: /\b[fs]("(?:"")*|'(?:'')*)(?:\\[\s\S]|[^\\])*?\1/,
				greedy: true,
				inside: {
					'interpolation': {
						pattern:
							/(?<=(?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)[^{}]+\})+\})+\}/,
						inside: {
							$rest: 'prql',
						},
					},
					'string': /[\s\S]+/,
				},
			},
			'raw-string': {
				// Raw strings have no escape sequences and cannot span multiple lines
				pattern: /\br("|')(?:(?!\1)[^\r\n])*\1/,
				greedy: true,
				alias: 'string',
			},
			'string': {
				// Opened by an odd number of quotes and closed by the same number; may span lines
				pattern: /("(?:"")*|'(?:'')*)(?:\\[\s\S]|[^\\])*?\1/,
				greedy: true,
			},
			'datetime': {
				// @2022-01-01, @12:00, @2022-01-01T12:00:00.123Z
				pattern: RegExp(
					'@(?:\\d{4}-\\d{2}-\\d{2}(?:T' + time + ')?|' + time + ')(?![\\w:-]|\\.(?!\\.))'
				),
				alias: 'number',
			},
			'annotation': {
				// @{binding_strength=1}
				pattern: /@\{(?:[^{}]|\{[^{}]*\})*\}/,
				inside: {
					'annotation-marker': {
						pattern: /^@/,
						alias: 'punctuation',
					},
					$rest: 'prql',
				},
			},
			'identifier': {
				// Quoted identifiers, e.g. `my column`
				pattern: /`[^`]*`/,
				greedy: true,
				inside: {
					'punctuation': /^`|`$/,
				},
			},
			'variable': {
				// Parameters, e.g. $1 or $name
				pattern: /\$[\w.]+/,
				greedy: true,
			},
			'keyword': /\b(?:case|enum|func|import|internal|into|let|module|prql|type)\b/,
			'builtin':
				/\b(?:aggregate|all|any|append|as|average|concat_array|count|count_distinct|derive|filter|first|from|from_text|group|in|intersect|join|lag|last|lead|loop|max|min|rank|rank_dense|read_csv|read_json|read_parquet|remove|row_number|select|sort|stddev|sum|take|tuple_map|tuple_reduce|tuple_reverse|tuple_uniq|tuple_zip|window)\b/,
			'boolean': /\b(?:false|null|true)\b/,
			'number':
				/\b0(?:b_?[01]+(?:_[01]+)*|o_?[0-7]+(?:_[0-7]+)*|x_?[\da-fA-F]+(?:_[\da-fA-F]+)*)\b|\b(?:[1-9][\d_]*|0)(?:days|hours|microseconds|milliseconds|minutes|months|seconds|weeks|years|(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?)\b/,
			'operator': /->|=>|[=!<>~]=|&&|\|\||\?\?|\/\/|\*\*|\.\.|[-+*/%<>=!|]/,
			'punctuation': /[{}[\](),.:]/,
		};
	},
};
