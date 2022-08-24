import { rest } from "./shared/symbols";

export interface LanguageProto {
	id: string;
	require?: LanguageProto | readonly LanguageProto[];
	optional?: string | readonly string[];
	alias?: string | readonly string[];
	grammar: Grammar | ((arg0: { getLanguage: (id: string) => Grammar, extend: (id: string, ref: GrammarTokens) => Grammar }) => Grammar)
}

/**
 * The expansion of a simple `RegExp` literal to support additional properties.
 */
export interface GrammarToken {
	/**
	 * The regular expression of the token.
	 */
	pattern: RegExp
	/**
	 * If `true`, then the first capturing group of `pattern` will (effectively) behave as a lookbehind group meaning that the captured text will not be part of the matched text of the new token.
	 *
	 * @default false
	 */
	lookbehind?: boolean
	/**
	 * Whether the token is greedy.
	 *
	 * @default false
	 */
	greedy?: boolean
	/**
	 * An optional alias or list of aliases.
	 */
	alias?: string | string[]
	/**
	 * The nested grammar of this token.
	 *
	 * The `inside` grammar will be used to tokenize the text value of each token of this kind.
	 *
	 * This can be used to make nested and even recursive language definitions.
	 *
	 * Note: This can cause infinite recursion. Be careful when you embed different languages or even the same language into
	 * each another.
	 */
	inside?: string | Grammar
	/**
	 * A property to make the types {@link GrammarToken} and {@link RegExp} non-overlapping.
	 *
	 * Since {@link GrammarToken} requires `exec` to be `undefined` and {@link RegExp} requires it to be a function,
	 * there can be no object that is both a {@link GrammarToken} and a {@link RegExp}.
	 */
	readonly exec?: never;
}

export type GrammarTokens = Partial<Record<string, RegExp | GrammarToken | (RegExp | GrammarToken)[]>>;
export interface GrammarSymbols {
	/**
	 * An optional grammar object that will be appended to this grammar.
	 */
	[rest]?: Grammar | string | null;
}
export type Grammar = GrammarTokens & GrammarSymbols;

export interface PlainObject {
	[key: string]: unknown;
}
