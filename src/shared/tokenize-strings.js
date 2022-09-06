/**
 * Given a token stream and a tokenization function, this will tokenize all
 * strings in the given token stream.
 *
 * The token stream returned by `tokenize` must have the same text content as
 * the given text.
 *
 * @param {import("../core/token").TokenStream} tokens
 * @param {(code: string) => import("../core/token").TokenStream} tokenize
 */
export function tokenizeStrings(tokens, tokenize) {
	/**
	 * @param {string} code
	 */
	const wrappedTokenize = (code) => {
		const tokens = tokenize(code);
		if (tokens.length === 1) {
			const single = tokens[0];
			if (typeof single === 'string') {
				return single;
			}
		}
		return tokens;
	};

	/**
	 * @param {import("../core/token").TokenStream} tokens
	 */
	const walkTokens = (tokens) => {
		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i];

			if (typeof token === 'string') {
				const result = wrappedTokenize(token);
				if (typeof result === 'string') {
					tokens[i] = result;
				} else {
					tokens.splice(i, 1, ...result);
					i += result.length - 1;
				}
			} else if (typeof token.content === 'string') {
				token.content = wrappedTokenize(token.content);
			} else {
				walkTokens(token.content);
			}
		}
	};

	walkTokens(tokens);
}
