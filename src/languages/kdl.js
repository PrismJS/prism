/** @type {import('../types.d.ts').LanguageProto<'kdl'>} */
export default {
	id: 'kdl',
	grammar () {
		// Characters that are NOT valid inside a bare identifier (KDL v2 set,
		// which is the more restrictive of v1/v2 in the ways that matter for
		// highlighting). Used as a negated character class.
		const NON_ID = '\\s\\\\/(){}[\\]"#;=';

		// Bare identifier. The dotted/signed first-character rules from the spec
		// are folded into one lookahead.
		const IDENT = `(?![+\\-]?\\.?\\d)[^${NON_ID}]+`;

		// Single-line quoted string. Permissive escape handling: a backslash plus
		// any single character is treated as an escape, no further structure.
		// (Being more specific about `\u{...}` causes regex-pattern ambiguity.)
		const QUOTED = '"(?:\\\\[\\s\\S]|[^"\\\\\\r\\n])*"';

		// Anything that can fill an identifier slot (node name, property key,
		// type annotation name).
		const STRINGY = `(?:${QUOTED}|${IDENT})`;

		// Keyword and number values can't touch identifier characters on either
		// side, so `foo-true`, `allow-null` and `utf-8` stay plain identifiers.
		const VALUE_START = `(?<![^${NON_ID}])`;
		const VALUE_END = `(?![^${NON_ID}])`;

		return {
			'comment': {
				pattern: /\/\/.*|\/\*[\s\S]*?\*\//,
				greedy: true,
			},
			'slashdash': {
				pattern: /\/-/,
				greedy: true,
				alias: 'comment',
			},
			'raw-string': {
				// v2 raw strings: one or more `#`s, then `"..."` or `"""..."""`.
				// v1 raw strings: `r`, then zero or more `#`s, then quotes.
				// Backreferences enforce matching hash counts and quotes on both sides.
				pattern: /(?:r|(?=#))(#*)("(?:"")?)[\s\S]*?\2\1/,
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
				pattern: RegExp(`"""[\\s\\S]*?"""|${QUOTED}`),
				greedy: true,
			},
			'tag': {
				// First identifier of a node: at the start of a line or right after
				// `{` or `;`, optionally preceded by a type annotation.
				pattern: RegExp(`(?<=(?:^|[{;])[\\t ]*(?:\\([^()]*\\)[\\t ]*)?)${STRINGY}`, 'm'),
				greedy: true,
			},
			'type-annotation': {
				// Must come before `boolean`/`null`/`number` so digits or
				// keyword-shaped type names (like `u8` or `true`) aren't shredded by
				// those rules.
				pattern: RegExp(`\\(\\s*${STRINGY}\\s*\\)`),
				inside: {
					'class-name': RegExp(STRINGY),
					'punctuation': /[()]/,
				},
			},
			'boolean': RegExp(`${VALUE_START}#?(?:false|true)${VALUE_END}`),
			'null': {
				pattern: RegExp(`${VALUE_START}#?null${VALUE_END}`),
				alias: 'keyword',
			},
			'number': RegExp(
				`${VALUE_START}(?:#-?inf|#nan|[+-]?(?:0x[\\da-fA-F][\\da-fA-F_]*|0o[0-7][0-7_]*|0b[01][01_]*|\\d[\\d_]*(?:\\.\\d[\\d_]*)?(?:[eE][+-]?\\d[\\d_]*)?))${VALUE_END}`
			),
			'punctuation': /[{};=\\]/,
		};
	},
};
