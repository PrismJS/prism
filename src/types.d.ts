import type {
	Language,
	LanguageGrammars,
	LanguageLike,
	LanguageProto,
	Languages,
} from './core/classes/language';
import type { PluginProto } from './core/classes/plugin-registry';
import type { Prism } from './core/classes/prism';
import type { Token, TokenName, TokenStream } from './core/classes/token';

export type { Token, TokenName, TokenStream };

export type { Prism } from './core/classes/prism';

export type { Language, Languages, LanguageGrammars, LanguageProto, LanguageLike };

export type {
	ComponentRegistryOptions,
	ComponentProtoBase,
} from './core/classes/component-registry';

export type { PluginProto };

export type { KebabToCamelCase } from './util/types';

export type ComponentProto = LanguageProto | PluginProto;

export interface PlainObject {
	[key: string]: unknown;
}

export interface GrammarOptions {
	readonly getLanguage: (id: string) => Grammar;
	readonly base?: Grammar;
	readonly languages: LanguageGrammars;
	readonly whenDefined: (id: string) => Promise<Language>;
}

export type RegExpLike = RegExp & { readonly pattern?: never };

/**
 * The expansion of a simple `RegExp` literal to support additional properties.
 */
export interface GrammarToken {
	/**
	 * The regular expression of the token.
	 */
	pattern: RegExp;

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

export type GrammarSpecial = {
	/**
	 * An optional grammar object that will be appended to this grammar.
	 */
	$rest?: Grammar | string | null;
	$tokenize?: (code: string, grammar: Grammar, Prism: Prism) => TokenStream;
};

export type GrammarTokens = GrammarTokensRec<GrammarTokensDepth> & GrammarSpecial;

/**
 * A grammar that is defined as its delta from another grammar
 */
export type GrammarPatch = {
	$insert?: GrammarTokens;
	$before?: TokenName | TokenName[];
	$after?: TokenName | TokenName[];
	$insertBefore?: GrammarTokens;
	$insertAfter?: GrammarTokens;
	$delete?: TokenName[];
	$merge?: GrammarTokens;
};

export type Grammar = GrammarTokens & GrammarSpecial & GrammarPatch;

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
type BuildTuple<N extends number, T extends unknown[] = []> = T['length'] extends N
	? T
	: BuildTuple<N, [unknown, ...T]>;

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
 * When the recursion limit is reached, the type system will use DeepRecursion instead of recursing further.
 * It prevents the type from becoming “any” or “unknown” without explanation.
 */
type DeepRecursion = { __deepRecursion: true };

/**
 * GrammarTokensRec is a recursive type that builds a partial record of token names as keys, with values that can be a RegExp, GrammarToken, or an array of those types.
 * It uses the decrement tuple to count down the depth of recursion, preventing infinite loops.
 */
type GrammarTokensRec<Depth extends number = GrammarTokensDepth> = Depth extends 0
	? DeepRecursion
	: Partial<
			Record<
				TokenName,
				| RegExpLike
				| GrammarToken
				| GrammarTokensRec<Decrement[Depth]>
				| (RegExpLike | GrammarToken | GrammarTokensRec<Decrement[Depth]>)[]
			>
		>;
