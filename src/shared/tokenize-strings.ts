import type { TokenStream } from '../core/token';

/**
 * Given a token stream and a tokenization function, this will tokenize all
 * strings in the given token stream.
 *
 * The token stream returned by `tokenize` must have the same text content as
 * the given text.
 */
export function tokenizeStrings(tokens: TokenStream, tokenize: (code: string) => TokenStream) {
	const wrappedTokenize = (code: string) => {
		const tokens = tokenize(code);
		if (tokens.length === 1) {
			const single = tokens[0];
			if (typeof single === 'string') {
				return single;
			}
		}
		return tokens;
	};

	const walkTokens = (tokens: TokenStream) => {
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
