/**
 * NLP++ dictionaries (.dict, https://visualtext.org/nlp/): each line is a
 * headword, one or more words, followed by the attribute=value pairs the
 * tokenizer attaches to matching text.
 *
 * @type {import('../types.d.ts').LanguageProto<'nlpplus-dict'>}
 */
export default {
	id: 'nlpplus-dict',
	grammar: {
		'comment': [
			{ pattern: /\/\*[\s\S]*?\*\//, greedy: true },
			{ pattern: /#.*/, greedy: true },
		],
		// The headword: words separated by spaces, up to the first attribute
		// name. The reader skips leading spaces. Words and spaces never overlap,
		// so there is no backtracking. Greedy, so that ^ is a real line start and
		// not the start of the text after a comment or string; it stops before
		// # or /*, so that it never takes a comment in.
		'headword': {
			pattern: /(?<=^[ \t]*)(?!\/\*)[^\s=#]+(?:[ \t]+(?![\w-]+[ \t]*=|\/\*)[^\s=#]+)*/m,
			greedy: true,
			alias: 'class-name',
		},
		'string': {
			pattern: /"(?:\\.|[^"\\\r\n])*"/,
			greedy: true,
		},
		'attr-name': /[\w-]+(?=\s*=)/,
		// The reader stores a value as a number only when it is all digits;
		// -5 and 1.5 are strings.
		'number': /(?<==\s*)\d+(?!\S)/,
		// A value runs to the next space or #, except inside quotes, and the
		// reader keeps it as one string: [gaelic,"scottish gaelic"] is stored
		// exactly so. Greedy, so it takes in the quoted parts already matched as
		// strings; a value that is only a quoted string stays a string.
		'attr-value': {
			pattern: /(?<==\s*)(?:[^\s"#=]|"(?:\\.|[^"\\\r\n])*")+/,
			greedy: true,
			alias: 'string',
		},
		'operator': /=/,
	},
};
