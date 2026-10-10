/**
 * NLP++ analyzer sequences (analyzer.seq, https://visualtext.org/nlp/): one
 * pass per line, the pass type, the pass file or nil, and a comment. A
 * leading slash makes a pass inactive.
 *
 * @type {import('../types.d.ts').LanguageProto<'nlpplus-seq'>}
 */
export default {
	id: 'nlpplus-seq',
	grammar: {
		'comment': [
			{ pattern: /\/\*[\s\S]*?\*\//, greedy: true },
			{ pattern: /#.*/, greedy: true },
			// a lone slash at the start of a line switches the pass off
			{ pattern: /^\/(?!\*).*/m, greedy: true, alias: 'inactive' },
		],
		// The pass file, or nil for passes that have none. These come before the
		// pass type: once the type is a token, their lookbehind cannot see it.
		'constant': {
			pattern:
				/(^(?:chartok|cmltok(?:enize)?|dicttokz?|end|folder|gen(?:hash)?|hash|intern|lines?|nintern|nlp|python|rec|stub|tok(?:en(?:ize)?)?)\s+)nil\b/im,
			lookbehind: true,
		},
		'function': {
			pattern:
				/(^(?:chartok|cmltok(?:enize)?|dicttokz?|end|folder|gen(?:hash)?|hash|intern|lines?|nintern|nlp|python|rec|stub|tok(?:en(?:ize)?)?)\s+)[^\s#]+/im,
			lookbehind: true,
		},
		// pass types the engine's sequence reader accepts
		'keyword':
			/^(?:chartok|cmltok(?:enize)?|dicttokz?|end|folder|gen(?:hash)?|hash|intern|lines?|nintern|nlp|python|rec|stub|tok(?:en(?:ize)?)?)\b/im,
	},
};
