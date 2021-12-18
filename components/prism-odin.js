(function (Prism) {
	var escapes = /\\(?:["'\\abefnrtv]|0[0-7]{2}|U[\dA-Fa-f]{6}|u[\dA-Fa-f]{4}|x[\dA-Fa-f]{2})/.source;

	function withEscapes(pattern, flags) {
		return RegExp(pattern.replace(/<escapes>/g, escapes), flags);
	}

	Prism.languages.odin = {
		/**
		 * The current implementation supports only 1 level of nesting.
		 *
		 * @author Michael Schmidt
		 * @author edukisto
		 */
		'comment': [
			{
				pattern: /\/\*(?:[^/*]|\/(?!\*)|\*(?!\/)|\/\*(?:\*(?!\/)|[^*])*(?:\*\/|$))*(?:\*\/|$)/,
				greedy: true
			},
			{
				pattern: /#![^\n\r]*/,
				greedy: true
			},
			{
				pattern: /\/\/[^\n\r]*/,
				greedy: true
			}
		],

		/**
		 * Should be found before strings because of '"'"- and '`'`-like sequences.
		 */
		'char': {
			pattern: withEscapes(/'(?:<escapes>|[^\n\r'\\])'/.source),
			greedy: true,
			inside: {
				'symbol': withEscapes(/<escapes>/.source)
			}
		},

		'string': [
			{
				pattern: /`[^`]*`/,
				greedy: true
			},
			{
				pattern: withEscapes(/"(?:<escapes>|[^\n\r"\\])*"/.source),
				greedy: true,
				inside: {
					'symbol': withEscapes(/<escapes>/.source)
				}
			}
		],

		'number': /(?:\b0(?:b[01_]+|d[\d_]+|h_*(?:(?:(?:[\dA-Fa-f]_*){8}){1,2}|(?:[\dA-Fa-f]_*){4})|o[0-7_]+|x[\dA-F_a-f]+|z[\dAB_ab]+)\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee][+-]?\d*)?[ijk]?)/,

		'boolean': /\b(?:_|false|nil|true)\b/,

		'keyword': /\b(?:asm|auto_cast|bit_set|break|case|cast|context|continue|defer|distinct|do|dynamic|else|enum|fallthrough|for|foreign|if|import|in|map|matrix|not_in|or_else|or_return|package|proc|return|struct|switch|transmute|typeid|union|using|when|where)\b/,

		'function': /\b\w+(?=[ \t]*\()/,

		'operator': /\+\+|---?|->|\.\.[<=]?|(?:&~|[-!*+/=~]|[%&<>|]{1,2})=?|[#$(),.:;?@\[\]^{}]/
	};
}(Prism));
