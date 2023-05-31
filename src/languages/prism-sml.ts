import type { LanguageProto } from '../types';

export default {
	id: 'sml',
	alias: 'smlnj',
	grammar() {
		// https://smlfamily.github.io/sml97-defn.pdf
		// https://people.mpi-sws.org/~rossberg/sml.html

		const keywords = /\b(?:abstype|and|andalso|as|case|datatype|do|else|end|eqtype|exception|fn|fun|functor|handle|if|in|include|infix|infixr|let|local|nonfix|of|op|open|orelse|raise|rec|sharing|sig|signature|struct|structure|then|type|val|where|while|with|withtype)\b/i;

		return {
			// allow one level of nesting
			'comment': /\(\*(?:[^*(]|\*(?!\))|\((?!\*)|\(\*(?:[^*(]|\*(?!\))|\((?!\*))*\*\))*\*\)/,
			'string': {
				pattern: /#?"(?:[^"\\]|\\.)*"/,
				greedy: true
			},

			'class-name': [
				{
					// This is only an approximation since the real grammar is context-free
					//
					// Why the main loop so complex?
					// The main loop is approximately the same as /(?:\s*(?:[*,]|->)\s*<TERMINAL>)*/ which is, obviously, a lot
					// simpler. The difference is that if a comma is the last iteration of the loop, then the terminal must be
					// followed by a long identifier.
					pattern: RegExp(
						/((?:^|[^:]):\s*)<TERMINAL>(?:\s*(?:(?:\*|->)\s*<TERMINAL>|,\s*<TERMINAL>(?:(?=<NOT-LAST>)|(?!<NOT-LAST>)\s+<LONG-ID>)))*/.source
							.replace(/<NOT-LAST>/g, () => /\s*(?:[*,]|->)/.source)
							.replace(/<TERMINAL>/g, () => /(?:'[\w']*|<LONG-ID>|\((?:[^()]|\([^()]*\))*\)|\{(?:[^{}]|\{[^{}]*\})*\})(?:\s+<LONG-ID>)*/.source)
							.replace(/<LONG-ID>/g, () => /(?!<KEYWORD>)[a-z\d_][\w'.]*/.source)
							.replace(/<KEYWORD>/g, () => keywords.source),
						'i'
					),
					lookbehind: true,
					greedy: true,
					inside: 'sml'
				},
				{
					pattern: /((?:^|[^\w'])(?:datatype|exception|functor|signature|structure|type)\s+)[a-z_][\w'.]*/i,
					lookbehind: true
				}
			],
			'function': {
				pattern: /((?:^|[^\w'])fun\s+)[a-z_][\w'.]*/i,
				lookbehind: true
			},

			'keyword': keywords,
			'variable': {
				pattern: /(^|[^\w'])'[\w']*/,
				lookbehind: true,
			},

			'number': /~?\b(?:\d+(?:\.\d+)?(?:e~?\d+)?|0x[\da-f]+)\b/i,
			'word': {
				pattern: /\b0w(?:\d+|x[\da-f]+)\b/i,
				alias: 'constant'
			},

			'boolean': /\b(?:false|true)\b/i,
			'operator': /\.\.\.|:[>=:]|=>?|->|[<>]=?|[!+\-*/^#|@~]/,
			'punctuation': /[(){}\[\].:,;]/
		};
	}
} as LanguageProto<'sml'>;
