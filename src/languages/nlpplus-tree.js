import registry from '../registry.js';

/**
 * NLP++ parse trees (.tree, https://visualtext.org/nlp/) as the engine writes
 * them: indented nodes with their offsets, type, flags and variables in
 * brackets, and the pass headers between snapshots.
 *
 * @type {import('../types.d.ts').LanguageProto<'nlpplus-tree'>}
 */
const Self = {
	id: 'nlpplus-tree',
	grammar: {
		'header': [
			{ pattern: /^\*+[ \t]*$/m, alias: 'comment' },
			// pass headers between the per-pass snapshots
			{ pattern: /^[ \t]*PASS[ \t]+\d+[ \t]+\(.*\)/m, alias: 'important' },
			{ pattern: /^[A-Z][A-Z ]* TREE:[ \t]*$/m, alias: 'important' },
		],
		// a node built by a rule, then a leaf token
		'node': {
			pattern: /(?<=^[ \t]*)_[\p{L}\p{N}_]+(?=[ \t]+\[)/mu,
			alias: 'class-name',
		},
		'leaf': {
			pattern: /(?<=^[ \t]*)\S+(?=[ \t]+\[)/m,
			alias: 'symbol',
		},
		// [start,end,ostart,oend,pass,rule,type,flags..., ("name" value ...) ...]
		// The engine writes each variable as ("name" v1 v2 ...) (lite/pn.cpp,
		// Iarg::genArg). A value is an integer, a float (C++ stream format,
		// possibly 1.23457e+06), a "string", concept:"..." (a KB concept),
		// pnode:"..." (a parse-tree node), kbobject:"<name>" (a KB phrase,
		// attribute or value) or <ostream>.
		'record': {
			pattern: /\[.*\][ \t]*$/m,
			inside: {
				'attr-name': {
					pattern: /(?<=\(\s*)"[^"\r\n]*"/,
				},
				'value-type': {
					pattern: /\b(?:concept|kbobject|pnode):(?=")/,
					alias: 'keyword',
				},
				// Only a one-character value is backslash-escaped ("\,"); a longer
				// string is written raw, quotes and all ("he said "hi""), so a
				// string ends at the quote that is followed by the next value or
				// the closing parenthesis.
				'string':
					/"(?:\\.|[^\\\r\n])*?"(?=[ \t]*\)|[ \t]+(?:[-\d"<]|concept:|kbobject:|pnode:))/,
				'constant': /<ostream>/,
				'node-type': {
					pattern: /\b(?:alpha|ctrl|emoji|node|null|num|punct|white)\b/,
					alias: 'builtin',
				},
				'flag': {
					pattern: /\b(?:b|blt|fired|sem|un)\b/,
					alias: 'keyword',
				},
				'number': /(?<![\w.])-?\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/,
				'punctuation': /[[\](),]/,
			},
		},
	},
};

export default Self;

registry.add(Self);
