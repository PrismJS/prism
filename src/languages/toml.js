/** @type {import('../types.d.ts').LanguageProto<'toml'>} */
export default {
	id: 'toml',
	grammar () {
		const key = /(?:[\w-]+|'[^'\n\r]*'|"(?:\\.|[^\\"\r\n])*")/.source;
		const dottedKey = key + '(?:\\s*\\.\\s*' + key + ')*';

		return {
			'comment': {
				pattern: /#.*/,
				greedy: true,
			},
			'table': {
				// keep entire table header (including brackets) under one parent token
				pattern: RegExp(
					'(^[\\t ]*)(?:\\[\\[\\s*' +
						dottedKey +
						'\\s*\\]\\]|\\[\\s*' +
						dottedKey +
						'\\s*\\])(?!\\])',
					'm'
				),
				lookbehind: true,
				greedy: true,
				inside: {
					'table-name': {
						pattern: RegExp('(^\\[\\[?\\s*)' + dottedKey),
						lookbehind: true,
						alias: 'variable',
					},
					'punctuation': /\[|\]/,
				},
			},
			'key': {
				pattern: RegExp('(^[\\t ]*|[{,]\\s*)' + dottedKey + '(?=\\s*=)', 'm'),
				lookbehind: true,
				greedy: true,
				alias: 'property',
			},
			'string': {
				pattern:
					/"""(?:\\[\s\S]|[^\\])*?"""|'''[\s\S]*?'''|'[^'\n\r]*'|"(?:\\.|[^\\"\r\n])*"/,
				greedy: true,
			},
			'date': [
				{
					// Offset Date-Time, Local Date-Time, Local Date
					pattern:
						/\b\d{4}-\d{2}-\d{2}(?:[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?\b/i,
					alias: 'number',
				},
				{
					// Local Time
					pattern: /\b\d{2}:\d{2}:\d{2}(?:\.\d+)?\b/,
					alias: 'number',
				},
			],
			'number':
				/(?:\b0(?:x[\da-zA-Z]+(?:_[\da-zA-Z]+)*|o[0-7]+(?:_[0-7]+)*|b[10]+(?:_[10]+)*))\b|[-+]?\b\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?\b|[-+]?\b(?:inf|nan)\b/,
			'boolean': /\b(?:false|true)\b/,
			'punctuation': /[.,=[\]{}]/,
		};
	},
};
