import registry from '../registry.js';

/** @type {import('../types.d.ts').LanguageProto<'soml'>} */
const Self = {
	id: 'soml',
	grammar () {
		// https://github.com/soml-lang/soml/blob/main/spec.md

		// An escaped double quote does not open a string, so comments are not retried.
		const string = /'[^'\n]*'|(?<!\\)"(?:\\.|[^"\\\n])*"/;

		// A key is bare (letters, digits, underscores, and dashes) or quoted.
		const key = '(?:[\\w-]+|' + string.source + ')';

		/*
		Token order matters:

		- `block-string` first, so its contents are not processed as keys or instants, and because `'''` also begins a valid `'...'` string.
		- `instant` before `key`, so an instant at the start of an array line is not read as a key.
		- `key` before strings and comments, so `404:`, `true:`, and `30s:` are keys and a `:` inside a quoted key does not split it. It is greedy so instants inside quoted keys do not split them. A false match inside a string or comment is replaced by that token, which starts earlier and is greedy.
		- `string` before `comment`, so a `#` inside a string stays in the string, and a comment that starts before a string still replaces it.
		*/
		return {
			'block-string': {
				/*
				The boundary makes the run maximal without consuming preceding comments, so a long run of quotes is not retried at every quote and blocks recover after comment rematching. Group 1 is the opening run and group 2 is the quote character. The body is whole lines taken lazily, so an empty block matches and the first line with the closing run ends the block. The closing run must match the opening run's length, so a longer run stays content.
				*/
				pattern: /(?<!['"])((['"])\2{2,})\r?\n(?:[^\n]*\n)*?[ \t]*\1(?!\2)/,
				greedy: true,
				alias: 'string',
			},
			'instant': {
				// 2026-09-19T14:00:00Z, 2026-09-19T14:00:00.123456789+02:00
				pattern:
					/\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})\b/,
				alias: 'number',
			},
			'key': {
				// A key is a bare or quoted token before a `:`. The boundary stops retries inside a bare key or an escaped quote.
				pattern: RegExp(/(?<![\w'"\\-])/.source + key + '(?=:)'),
				greedy: true,
				alias: 'property',
			},
			'string': {
				pattern: string,
				greedy: true,
			},
			'comment': {
				pattern: /#[^\n]*|\/\*(?:[^*]|\*(?!\/))*(?:\*\/|$)/,
				greedy: true,
			},
			'date': {
				// A calendar date is one token; a date-like key stays a property.
				pattern: /(?<![\w.+-])\d{4}-\d{2}-\d{2}(?![\w.+:-])/,
				alias: 'number',
			},
			'duration': {
				// 30s, 1m30s, 1.5s, 500ms, 2us, 3ns
				pattern: /-?\b(?:\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:h|ms?|ns|s|us))+\b/,
				alias: 'number',
			},
			'number':
				// 0, 42, -1, 1.5, 1e5, 1_000, 0xFF, 0o644, 0b1010, infinity
				/-?\b(?:0x[\da-fA-F]+(?:_[\da-fA-F]+)*|0o[0-7]+(?:_[0-7]+)*|0b[01]+(?:_[01]+)*|\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:e[-+]?\d+(?:_\d+)*)?|infinity)\b/,
			'boolean': /\b(?:false|true)\b/,
			'null': {
				pattern: /\bnull\b/,
				alias: 'keyword',
			},
			'punctuation': /[{}[\]:,]/,
		};
	},
};

export default Self;

registry.add(Self);
