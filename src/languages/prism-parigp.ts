import type { LanguageProto } from '../types';

export default {
	id: 'parigp',
	grammar() {
		const keywords = [
			'breakpoint', 'break', 'dbg_down', 'dbg_err', 'dbg_up', 'dbg_x',
			'forcomposite', 'fordiv', 'forell', 'forpart', 'forprime',
			'forstep', 'forsubgroup', 'forvec', 'for', 'iferr', 'if',
			'local', 'my', 'next', 'return', 'until', 'while'
		];

		return {
			'comment': /\/\*[\s\S]*?\*\/|\\\\.*/,
			'string': {
				pattern: /"(?:[^"\\\r\n]|\\.)*"/,
				greedy: true
			},
			// PARI/GP does not care about white spaces at all
			// so let's process the keywords to build an appropriate regexp
			// (e.g. "b *r *e *a *k", etc.)
			'keyword': RegExp(
				'\\b(?:' +
				keywords.map((keyword) => keyword.split('').join(' *')).join('|') +
				')\\b'
			),
			'function': /\b\w(?:[\w ]*\w)?(?= *\()/,
			'number': {
				// The lookbehind and the negative lookahead prevent from breaking the .. operator
				pattern: /((?:\. *\. *)?)(?:\b\d(?: *\d)*(?: *(?!\. *\.)\.(?: *\d)*)?|\. *\d(?: *\d)*)(?: *e *(?:[+-] *)?\d(?: *\d)*)?/i,
				lookbehind: true
			},
			'operator': /\. *\.|[*\/!](?: *=)?|%(?: *=|(?: *#)?(?: *')*)?|\+(?: *[+=])?|-(?: *[-=>])?|<(?: *>|(?: *<)?(?: *=)?)?|>(?: *>)?(?: *=)?|=(?: *=){0,2}|\\(?: *\/)?(?: *=)?|&(?: *&)?|\| *\||['#~^]/,
			'punctuation': /[\[\]{}().,:;|]/
		};
	}
} as LanguageProto<'parigp'>;
