/**
 * NLP++ knowledge bases (.kbb, https://visualtext.org/nlp/): an indented
 * hierarchy of concepts, each optionally followed by a colon and
 * comma-separated attribute=value pairs.
 *
 * @type {import('../types.d.ts').LanguageProto<'nlpplus-kbb'>}
 */
export default {
	id: 'nlpplus-kbb',
	alias: 'kbb',
	grammar: {
		'comment': [
			{ pattern: /\/\*[\s\S]*?\*\//, greedy: true },
			{ pattern: /#.*/, greedy: true },
		],
		// Indentation is the hierarchy: a concept at the start of a line is a
		// top-level one, an indented concept sits below another. Greedy, so that
		// ^ is a real line start and not the start of the text after a comment;
		// a name stops before # or /*, so that it never takes a comment in.
		'concept': [
			{
				pattern: /^(?!\/\*)[^\s:#]+(?:[ \t]+(?!\/\*)[^\s:#]+)*/m,
				greedy: true,
				alias: 'namespace',
			},
			{
				pattern: /(?<=^[ \t]+)(?!\/\*)[^\s:#]+(?:[ \t]+(?!\/\*)[^\s:#]+)*/m,
				greedy: true,
				alias: 'class-name',
			},
		],
		'string': {
			pattern: /"(?:\\.|[^"\\\r\n])*"/,
			greedy: true,
		},
		'attr-name': /[\w-]+(?=\s*=)/,
		// The reader stores a value as a number only when it is all digits;
		// -5 and 1.5 are strings.
		'number': /(?<=[=[,]\s*)\d+(?![^\s,\]])/,
		'attr-value': {
			pattern: /(?<=[=[,]\s*)[^\s"[\],=]+/,
			alias: 'string',
		},
		'operator': /=/,
		'punctuation': /[[\],:]/,
	},
};
