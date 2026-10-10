/**
 * NLP++ parse trees (.tree, https://visualtext.org/nlp/) as the engine writes
 * them: indented nodes with their offsets, type, flags and variables in
 * brackets, and the pass headers between snapshots.
 *
 * @type {import('../types.d.ts').LanguageProto<'nlpplus-tree'>}
 */
export default {
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
			pattern: /(^[ \t]*)_\w+(?=[ \t]+\[)/m,
			lookbehind: true,
			alias: 'class-name',
		},
		'leaf': {
			pattern: /(^[ \t]*)\S+(?=[ \t]+\[)/m,
			lookbehind: true,
			alias: 'symbol',
		},
		// [start,end,ostart,oend,pass,rule,type,flags..., ("name" value) ...]
		'record': {
			pattern: /\[.*\][ \t]*$/m,
			inside: {
				'attr-name': {
					pattern: /(\(\s*)"(?:\\.|[^"\\])*"/,
					lookbehind: true,
				},
				'string': /"(?:\\.|[^"\\])*"/,
				'node-type': {
					pattern: /\b(?:alpha|ctrl|emoji|node|null|num|punct|white)\b/,
					alias: 'builtin',
				},
				'flag': {
					pattern: /\b(?:b|blt|fired|sem|un)\b/,
					alias: 'keyword',
				},
				'number': /\b\d+\b/,
				'punctuation': /[[\](),]/,
			},
		},
	},
};
