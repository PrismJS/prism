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

		// Raw string. v2: one or more `#`s, then `"..."` or `"""..."""`. v1: `r`,
		// then zero or more `#`s, then quotes. Backreferences make the closing
		// quotes and `#`s match the opening ones, and the body can't contain the
		// closing sequence, so a match never runs past its own end.
		const RAW = '(?:r|(?=#))(#*)("(?:"")?)(?:(?!\\2\\1)[\\s\\S])*\\2\\1';

		// Anything that can fill an identifier slot (node name, property key,
		// type annotation name).
		const STRINGY = `(?:${RAW}|${QUOTED}|${IDENT})`;

		// Keyword and number values can't touch identifier characters on either
		// side, so `foo-true`, `allow-null` and `utf-8` are whole identifiers
		// rather than identifiers with a value inside.
		const VALUE_START = `(?<![^${NON_ID}])`;
		const VALUE_END = `(?![^${NON_ID}])`;

		// Where a node can start: the start of a line (unless the line before ends
		// in a `\` continuation), or right after `{` or `;`.
		const NODE_START = '(?:^(?<!\\\\[\\t ]*(?://.*)?\\r?\\n)|[{;])[\\t ]*';
		// A type annotation, like `(u8)`, and any space after it.
		const TYPE = '\\([^()]*\\)[\\t ]*';

		// Slashdash (`/-`) comments out the node, argument, property or children
		// block that follows it. These pieces describe just enough of KDL to find
		// where that element ends, and are kept unambiguous so they can't
		// backtrack badly. Every string is treated as `"..."`, which also covers
		// multi-line and raw strings, unless a raw string contains an odd number
		// of `"`s or a `\"`.
		const SD_STRING = '"(?:\\\\[\\s\\S]|[^"\\\\])*"';
		const SD_BLOCK_COMMENT = '/\\*(?:[^*]|\\*(?!/))*\\*/';
		// Whitespace, newlines and comments allowed between `/-` and its target.
		const SD_SPACE = `(?:\\s|//.*$|${SD_BLOCK_COMMENT})*`;
		// A children block, nested up to `depth` levels.
		const sdBlock = depth =>
			'\\{(?:' +
			`${SD_STRING}|${SD_BLOCK_COMMENT}|//.*$|/(?![/*])|[^{}"/]` +
			(depth > 1 ? `|${sdBlock(depth - 1)}` : '') +
			')*\\}';
		const SD_CHILDREN = sdBlock(6);
		// The rest of a node: everything up to an unescaped newline, `;`, the `}`
		// of the enclosing block, or a line comment.
		const SD_NODE_REST =
			'(?:' +
			`${SD_STRING}|${SD_BLOCK_COMMENT}|/(?![/*])` +
			'|\\\\[\\t ]*(?://.*)?\\r?\\n' +
			`|${SD_CHILDREN}` +
			'|[^\\r\\n;{}"/\\\\]' +
			')*';
		// An argument or property, with optional type annotations.
		const SD_VALUE = `(?:${TYPE})?(?:r?#*${SD_STRING}#*|#?[^${NON_ID}]+)`;
		const SD_ENTRY = `${SD_VALUE}(?:[\\t ]*=[\\t ]*${SD_VALUE})?`;

		return {
			'comment': {
				pattern: /\/\/.*|\/\*[\s\S]*?\*\//,
				greedy: true,
			},
			'slashdash': {
				pattern: RegExp(
					// A whole node, when `/-` is where a node starts.
					`(?<=${NODE_START})/-${SD_SPACE}(?!\\s)${SD_NODE_REST}` +
					// Otherwise a children block, property or argument.
					`|/-${SD_SPACE}(?:${SD_CHILDREN}|${SD_ENTRY})` +
					// Fallback if what follows can't be matched.
					'|/-',
					'm'
				),
				greedy: true,
				alias: 'comment',
			},
			'property': {
				// Comes before the string tokens so quoted and raw keys are
				// properties.
				pattern: RegExp(`${STRINGY}(?=\\s*=[^=])`),
				greedy: true,
				alias: 'attr-name',
			},
			'tag': {
				// First name of a node, optionally after a type annotation. Comes
				// before the string tokens so quoted and raw node names are tags too.
				pattern: RegExp(`(?<=${NODE_START}(?:${TYPE})?)${STRINGY}`, 'm'),
				greedy: true,
			},
			'raw-string': {
				pattern: RegExp(RAW),
				greedy: true,
				alias: 'string',
			},
			'string': {
				pattern: RegExp(`"""[\\s\\S]*?"""|${QUOTED}`),
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
			'identifier-string': {
				// A bare identifier used as a value, like `my-pkg` in `name my-pkg`.
				// KDL v2 treats it as a string, the same as `"my-pkg"`.
				pattern: RegExp(`${VALUE_START}${IDENT}${VALUE_END}`),
				alias: 'string',
			},
			'punctuation': /[{};=\\]/,
		};
	},
};
