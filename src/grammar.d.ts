import type { TokenStream } from './core/token';
import type { rest, tokenize } from './shared/symbols';

export interface GrammarOptions {
	readonly getLanguage: (id: string) => Grammar;
	readonly getOptionalLanguage: (id: string) => Grammar | undefined;
	readonly extend: (id: string, ref: GrammarTokens) => Grammar;
}

export type StandardTokenName =
	| 'atrule'
	| 'attr-name'
	| 'attr-value'
	| 'bold'
	| 'boolean'
	| 'builtin'
	| 'cdata'
	| 'char'
	| 'class-name'
	| 'comment'
	| 'constant'
	| 'deleted'
	| 'doctype'
	| 'entity'
	| 'function'
	| 'important'
	| 'inserted'
	| 'italic'
	| 'keyword'
	| 'namespace'
	| 'number'
	| 'operator'
	| 'prolog'
	| 'property'
	| 'punctuation'
	| 'regex'
	| 'selector'
	| 'string'
	| 'symbol'
	| 'tag'
	| 'url';

export type TokenName = (string & {}) | StandardTokenName;

export type RegExpLike = RegExp & { readonly pattern?: never };

/**
 * The expansion of a simple `RegExp` literal to support additional properties.
 */
export interface GrammarToken {
	/**
	 * The regular expression of the token.
	 */
	pattern: RegExpLike;
	/**
	 * If `true`, then the first capturing group of `pattern` will (effectively) behave as a lookbehind group meaning that the captured text will not be part of the matched text of the new token.
	 *
	 * @default false
	 */
	lookbehind?: boolean;
	/**
	 * Whether the token is greedy.
	 *
	 * @default false
	 */
	greedy?: boolean;
	/**
	 * An optional alias or list of aliases.
	 */
	alias?: TokenName | TokenName[];
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
	inside?: string | Grammar | null;
}

export type GrammarTokens = GrammarTokensRec<GrammarTokensDepth>;

export interface GrammarSymbols {
	/**
	 * An optional grammar object that will be appended to this grammar.
	 */
	[rest]?: Grammar | string | null;
	[tokenize]?: (code: string, grammar: Grammar, Prism: Prism) => TokenStream;
}

export interface GrammarSpecial {
	$insertBefore?: GrammarTokens;
	$delete?: (string | undefined)[];
	$merge?: GrammarTokens;
}

export type Grammar = GrammarTokens & GrammarSymbols & GrammarSpecial;

/**
 * Recursive type helpers for GrammarTokens
 *
 * Why do we need this?
 * The structure of a Prism grammar is inherently recursive: a token can contain an “inside” grammar, which itself is a set of tokens, and so on.
 * To accurately type this, we need a recursive type definition.
 *
 * Why not just use the old type?
 * ```ts
 * export type GrammarTokens = Partial<Record<TokenName, RegExpLike | GrammarToken | GrammarTokens | (RegExpLike | GrammarToken | GrammarTokens)[]>>;
 * ```
 * This type definition is infinitely recursive, which caused TypeScript to give up and treat it as “any”.
 * By introducing a recursion depth limit (using a decrement tuple), we keep the type safe and precise, and prevent TypeScript from running into infinite recursion.
 *
 * The helpers below allow us to control the recursion depth in one place, making the type both maintainable and type-safe.
 */

// Centralize the depth
type GrammarTokensDepth = 5;

// Helper to build a tuple of length N
type BuildTuple<L extends number, T extends unknown[] = []> = T['length'] extends L
	? T
	: BuildTuple<L, [unknown, ...T]>;

/**
 * Helper to generate a decrement tuple
 *
 * TypeScript can't subtract numbers at the type level, so we use a tuple (array) to "count down" the depth for recursion.
 * This lets us limit how many times GrammarTokensRec can call itself, which prevents infinite recursion and keeps the type safe.
 */
type DecrementTuple<T extends unknown[], R extends number[] = []> = T extends [
	unknown,
	...infer Rest,
]
	? DecrementTuple<Rest, [...R, Rest['length']]>
	: R;

// The actual decrement tuple, derived from the depth
type Decrement = DecrementTuple<BuildTuple<GrammarTokensDepth>>;

/**
 * GrammarTokensRec is a recursive type that builds a partial record of token names as keys, with values that can be a RegExp, GrammarToken, or an array of those types.
 * It uses the decrement tuple to count down the depth of recursion, preventing infinite loops.
 */
type GrammarTokensRec<Depth extends number = GrammarTokensDepth> = Depth extends 0
	? never
	: Partial<
			Record<
				TokenName,
				| RegExpLike
				| GrammarToken
				| GrammarTokensRec<Decrement[Depth]>
				| (RegExpLike | GrammarToken | GrammarTokensRec<Decrement[Depth]>)[]
			>
		>;
