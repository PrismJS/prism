import registry from '../registry.js';

/**
 * NLP++ analyzer sequences (analyzer.seq, https://visualtext.org/nlp/): one
 * pass per line, the pass type, the pass file or nil, and a comment. A
 * leading slash makes a pass inactive; two slashes start a comment.
 *
 * @type {import('../types.d.ts').LanguageProto<'nlpplus-seq'>}
 */
const Self = {
	id: 'nlpplus-seq',
	grammar: {
		'comment': [
			{ pattern: /\/\*[\s\S]*?\*\//, greedy: true },
			// like #, a // comment can start anywhere on the line
			{ pattern: /(?:#|\/\/).*/, greedy: true },
			// a lone slash at the start of a line switches the pass off
			{ pattern: /^\/.*/m, greedy: true, alias: 'inactive' },
		],
		'pass': {
			pattern:
				/^(?:chartok|cmltok(?:enize)?|dicttokz?|end|endzone|folder|gen(?:hash)?|hash|intern|lines?|nintern|nlp|pat|python|rec|stub|tok(?:en(?:ize)?)?|zone)\b.*/im,
			inside: {
				// pass types the engine's sequence reader accepts; "pat" is read as "nlp"
				'keyword': /^\w+/,
				// the pass file, or nil for passes that have none
				'constant': /\bnil\b/i,
				'function': /\S+/,
			},
		},
	},
};

export default Self;

registry.add(Self);
