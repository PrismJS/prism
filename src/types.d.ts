import type { Prism } from './core/prism';
import type { TokenStream } from './core/token';
import type { KnownPlugins } from './known-plugins';
import type { rest, tokenize } from './shared/symbols';

export interface GrammarOptions {
	readonly getLanguage: (id: string) => Grammar;
	readonly getOptionalLanguage: (id: string) => Grammar | undefined;
	readonly extend: (id: string, ref: GrammarTokens) => Grammar
}
export interface ComponentProtoBase<Id extends string = string> {
	id: Id;
	require?: LanguageProto | readonly LanguageProto[];
	optional?: string | readonly string[];
	alias?: string | readonly string[];
	// eslint-disable-next-line @typescript-eslint/ban-types
	effect?: (Prism: Prism & { plugins: Record<KebabToCamelCase<Id>, {}> }) => (() => void);
}
export interface LanguageProto<Id extends string = string> extends ComponentProtoBase<Id> {
	grammar: Grammar | ((options: GrammarOptions) => Grammar);
}
type PluginType<Name extends string> = Name extends keyof KnownPlugins ? KnownPlugins[Name] : unknown;
export interface PluginProto<Id extends string = string> extends ComponentProtoBase<Id> {
	// eslint-disable-next-line @typescript-eslint/ban-types
	plugin?: (Prism: Prism & { plugins: Record<KebabToCamelCase<Id>, undefined> }) => PluginType<KebabToCamelCase<Id>> & {};
}
export type ComponentProto = LanguageProto | PluginProto;

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
	| 'url'
	;

// eslint-disable-next-line @typescript-eslint/ban-types
export type TokenName = string & {} | StandardTokenName;

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
	alias?: TokenName | TokenName[]
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
	inside?: string | Grammar | null
	/**
	 * A property to make the types {@link GrammarToken} and {@link RegExp} non-overlapping.
	 *
	 * Since {@link GrammarToken} requires `exec` to be `undefined` and {@link RegExp} requires it to be a function,
	 * there can be no object that is both a {@link GrammarToken} and a {@link RegExp}.
	 */
	readonly exec?: never;
}

export type GrammarTokens = Partial<Record<TokenName, RegExp | GrammarToken | (RegExp | GrammarToken)[]>>;
export interface GrammarSymbols {
	/**
	 * An optional grammar object that will be appended to this grammar.
	 */
	[rest]?: Grammar | string | null;
	[tokenize]?: (code: string, grammar: Grammar, Prism: Prism) => TokenStream;
}
export type Grammar = GrammarTokens & GrammarSymbols;

export interface PlainObject {
	[key: string]: unknown;
}

export type KebabToCamelCase<S extends string> = S extends `${infer T}-${infer U}` ? `${T}${Capitalize<KebabToCamelCase<U>>}` : S;
