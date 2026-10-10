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
		// Before the strings: Prism splits the text around each string, and a
		// line-start pattern run afterwards would match at those splits too.
		// The headword: words separated by spaces, up to the first attribute
		// name. Words and spaces never overlap, so there is no backtracking.
		'headword': {
			pattern: /^[^\s#/=][^\s=]*(?:[ \t]+(?![\w-]+[ \t]*=)[^\s=]+)*/m,
			alias: 'class-name',
		},
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
			pattern: /(=\s*)-?\d+(?:\.\d+)?(?!\S)/,
			lookbehind: true,
		},
		'attr-value': {
			pattern: /(=\s*)[^\s"=]+/,
			lookbehind: true,
			alias: 'string',
		},
		'operator': /=/,
	},
};
