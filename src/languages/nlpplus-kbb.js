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
		// Before the strings: Prism splits the text around each string, and a
		// line-start pattern run afterwards would match at those splits too.
		// Indentation is the hierarchy: a concept at the start of a line is a
		// top-level one, an indented concept sits below another.
		'concept': [
			{
				pattern: /^[^\s#/:][^:\n]*?(?=:|$)/m,
				alias: 'namespace',
			},
			{
				pattern: /(^[ \t]+)[^\s#/:][^:\n]*?(?=:|$)/m,
				lookbehind: true,
				alias: 'class-name',
			},
		],
		'comment': [
			{ pattern: /\/\*[\s\S]*?\*\//, greedy: true },
			{ pattern: /#.*/, greedy: true },
		],
		'string': {
			pattern: /"(?:\\.|[^"\\\r\n])*"/,
			greedy: true,
		},
		'attr-name': /[\w-]+(?=\s*=)/,
		'number': {
			pattern: /([=[,]\s*)-?\d+(?:\.\d+)?(?![^\s,\]])/,
			lookbehind: true,
		},
		'attr-value': {
			pattern: /([=[,]\s*)[^\s"[\],=]+/,
			lookbehind: true,
			alias: 'string',
		},
		'operator': /=/,
		'punctuation': /[[\],:]/,
	},
};
