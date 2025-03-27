// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Grammar, GrammarToken, TokenName } from '../types';

export class Token {
	/**
	 * The type of the token.
	 *
	 * This is usually the key of a pattern in a {@link Grammar}.
	 *
	 * @see {@link GrammarToken}
	 */
	type: TokenName;
	/**
	 * The strings or tokens contained by this token.
	 *
	 * This will be a token stream if the pattern matched also defined an `inside` grammar.
	 */
	content: string | TokenStream;
	/**
	 * The alias(es) of the token.
	 *
	 * @see {@link GrammarToken#alias}
	 */
	alias?: TokenName | TokenName[];

	/**
	 * Length of the full string this token was created from.
	 *
	 * Only used internally. The API does not guarantee that this field has any particular value or meaning.
	 *
	 * @internal
	 */
	length: number;

	/**
	 * Creates a new token.
	 *
	 * @param type See {@link Token#type}
	 * @param content See {@link Token#content}
	 * @param alias The alias(es) of the token.
	 * @param matchedStr A copy of the full string this token was created from.
	 * @public
	 */
	constructor (
		type: TokenName,
		content: string | TokenStream,
		alias?: TokenName | TokenName[],
		matchedStr = ''
	) {
		this.type = type;
		this.content = content;
		this.alias = alias;
		this.length = matchedStr.length;
	}

	/**
	 * Adds the given alias to the list of aliases of this token.
	 */
	addAlias (alias: TokenName): void {
		let aliases = this.alias;
		if (!aliases) {
			this.alias = aliases = [];
		}
		else if (!Array.isArray(aliases)) {
			this.alias = aliases = [aliases];
		}
		aliases.push(alias);
	}
}

/**
 * A token stream is an array of strings and {@link Token Token} objects.
 *
 * Token streams have to fulfill a few properties that are assumed by most functions (mostly internal ones) that process
 * them.
 *
 * 1. No adjacent strings.
 * 2. No empty strings.
 *
 *    The only exception here is the token stream that only contains the empty string and nothing else.
 */
export type TokenStream = (string | Token)[];

/**
 * Returns the text content of the given token or token stream.
 */
export function getTextContent (token: string | Token | TokenStream): string {
	if (typeof token === 'string') {
		return token;
	}
	else if (Array.isArray(token)) {
		return token.map(getTextContent).join('');
	}
	else {
		return getTextContent(token.content);
	}
}
