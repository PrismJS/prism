/** @type {import('../types.d.ts').LanguageProto<'kdl'>} */
export default {
	id: 'kdl',
	grammar () {
		// Characters that are NOT valid inside a bare identifier (KDL v2 set,
		// which is the more restrictive of v1/v2 in the ways that matter for
		// highlighting). Used as a negated character class.
		const NON_ID = '\\s\\\\/(){}\\[\\]"#;=';
		const IDENT_BODY = `[^${NON_ID}]`;

		// Bare identifier. The dotted/signed first-character rules from the spec
		// are folded into three alternatives, longest-form first so the regex
		// engine doesn't commit to a one-char match when more is available.
		const IDENT =
			'(?:' +
				// optional sign, dot, then a non-digit body
				`[+\\-]?\\.(?:[^${NON_ID}0-9]${IDENT_BODY}*)?` +
				'|' +
				// sign, then a non-digit, non-dot body
				`[+\\-](?:[^${NON_ID}0-9.]${IDENT_BODY}*)?` +
				'|' +
				// plain start: non-digit, non-sign, non-dot, non-special
				`[^${NON_ID}0-9+\\-.]${IDENT_BODY}*` +
			')';

		// Single-line quoted string. Permissive escape handling: a backslash plus
		// any single character is treated as an escape, no further structure.
		// (Being more specific about `\u{...}` causes regex-pattern ambiguity.)
		const QUOTED = '"(?:\\\\[\\s\\S]|[^"\\\\\\r\\n])*"';

		// Anything that can fill an identifier slot (node name, property key,
		// type annotation name).
		const STRINGY = `(?:${QUOTED}|${IDENT})`;

		return {
			'comment': {
				pattern: /\/\/.*|\/\*[\s\S]*?\*\//,
				greedy: true,
			},
			'slashdash': {
				pattern: /\/-/,
				alias: 'comment',
			},
			'raw-string': {
				// v2 raw strings: one or more `#`s, then `"..."` or `"""..."""`.
				// v1 raw strings: `r`, then zero or more `#`s, then quotes.
				// Backreferences enforce matching hash counts on both sides.
				pattern: /(#+)"""[\s\S]*?"""\1|(#+)"[\s\S]*?"\2|r(#*)"""[\s\S]*?"""\3|r(#*)"[\s\S]*?"\4/,
				greedy: true,
				alias: 'string',
			},
			'property': {
				// Must come before `string` so quoted-string keys win over the
				// generic string pattern.
				pattern: RegExp(`${STRINGY}(?=\\s*=[^=])`),
				greedy: true,
				alias: 'attr-name',
			},
			'string': {
				pattern: /"""[\s\S]*?"""|"(?:\\[\s\S]|[^"\\\r\n])*"/,
				greedy: true,
			},
			'type-annotation': {
				// Must come before `number`/`keyword` so digits or keyword-shaped
				// type names (like `u8` or `true`) aren't shredded by those rules.
				pattern: RegExp(`\\(\\s*${STRINGY}\\s*\\)`),
				inside: {
					'class-name': RegExp(STRINGY),
					'punctuation': /[()]/,
				},
			},
			'keyword': /#(?:true|false|null|-inf|inf|nan)\b|\b(?:true|false|null)\b/,
			'number': /[+-]?(?:0x[\da-fA-F][\da-fA-F_]*|0o[0-7][0-7_]*|0b[01][01_]*|\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d[\d_]*)?)/,
			'tag': {
				// First identifier on a line, or right after `{`, `;`, or a
				// type annotation's closing `)`. Handles whitespace in between.
				pattern: RegExp(`(^[\\t ]*|[{;)][\\t ]*)${STRINGY}`, 'm'),
				lookbehind: true,
				greedy: true,
			},
			'punctuation': /[{};=\\]/,
		};
	},
};
