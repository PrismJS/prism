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

export type GrammarTokens = Partial<
	Record<
		TokenName,
		RegExpLike | GrammarToken | GrammarTokens | (RegExpLike | GrammarToken | GrammarTokens)[]
	>
>;
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
