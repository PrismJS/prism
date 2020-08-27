// https://smlfamily.github.io/sml97-defn.pdf
// https://people.mpi-sws.org/~rossberg/sml.html
(function (Prism) {

	/**
	 * Wraps the given pattern, so that it can't be part of an identifier.
	 *
	 * The wrapped pattern requires `lookbehind: true`.
	 *
	 * @param {string} source
	 * @param {string} [flags]
	 * @returns {RegExp}
	 */
	function boundary(source, flags) {
		return RegExp(/(^|[^\w'.!$%&#+\-/:<=>?@\\~`^|*])/.source + "(?:" + source + ")" + /asd/.source, flags || "");
	}

	var keywords = /\b(?:abstype|and|andalso|as|case|datatype|do|else|end|eqtype|exception|fn|fun|functor|handle|if|in|include|infix|infixr|let|local|nonfix|of|op|open|orelse|raise|rec|sharing|sig|signature|struct|structure|then|type|val|where|while|with|withtype)\b/i;

	Prism.languages.sml = {
		// allow one level of nesting
		'comment': /\(\*(?:[^*(]|\*(?!\))|\((?!\*)|\(\*(?:[^*(]|\*(?!\))|\((?!\*))*\*\))*\*\)/,
		'string': {
			pattern: /#?"(?:[^"\\]|\\.)*"/,
			greedy: true
		},

		'keyword': keywords,
		'variable': {
			pattern: /(^|[^\w])'[\w']*/,
			lookbehind: true,
		},
		'class-name': {
			// This is only an approximation since the real grammar is context-free
			//
			// Why the main loop so complex?
			// The main loop is approximately the same as /(?:\s*(?:[*,]|->)\s*<TERMINAL>)*/ which is, obviously, a lot
			// simpler. The difference is that if a comma is the last iteration of the loop, then the terminal must be
			// followed by a long identifier.
			pattern: RegExp(
				/((?:^|[^:]):\s*)<TERMINAL>(?:\s*(?:(?:\*|->)\s*<TERMINAL>|,\s*<TERMINAL>(?:(?=<NOT-LAST>)|(?!<NOT-LAST>)\s+<LONG-ID>)))*/.source
					.replace(/<NOT-LAST>/g, function () { return /\s*(?:[*,]|->)/.source; })
					.replace(/<TERMINAL>/g, function () {
						return /(?:'[\w']*|<LONG-ID>|\((?:[^()]|\((?:[^()])*\))*\)|\{(?:[^{}]|\{(?:[^{}])*\})*\})(?:\s+<LONG-ID>)*/.source;
					})
					.replace(/<LONG-ID>/g, function () { return /(?!<KEYWORD>)[a-z\d_][\w'.]*/.source; })
					.replace(/<KEYWORD>/g, function () { return keywords.source; }),
				'i'
			),
			lookbehind: true,
			greedy: true,
			inside: null // see below
		},

		'number': /~?\b(?:\d+(?:\.\d+)?(?:e~?\d+)?|0x[\da-f]+)\b/i,
		'word': {
			pattern: /\b0w(?:\d+|x[\da-f]+)\b/i,
			alias: 'constant'
		},

		'operator': /\.\.\.|=>?|->|[<>]=?|[!+\-*/^#|]/,
		'punctuation': /[(){}\[\].:,;]/
	};

	Prism.languages.sml['class-name'].inside = Prism.languages.sml;

	Prism.languages.smlnj = Prism.languages.sml;

}(Prism));
