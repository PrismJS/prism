import type { Token } from './core/classes/token.js';
import type { Prism } from './core/prism.js';

export interface PrismConfig {
	manual?: boolean;
}

export type GlobalConfig = Record<string, PrismConfig[keyof PrismConfig] | null>;

export interface BaseHookEnv {
	context?: object;
}

export interface HookEnv extends BaseHookEnv, Record<string, any> {}

export type HookCallback<T extends keyof HookEnv = string> = (env: HookEnv[T]) => void;

export type MultipleHooks<T extends keyof HookEnv> = { [K in T]?: HookCallback<K> };

export type HooksAll = Record<keyof HookEnv, HookCallback[]>;

export type HooksAdd = <Name extends keyof HookEnv>(
	name: Name | Name[] | MultipleHooks<Name>,
	callback?: Name extends MultipleHooks<Name> ? never : HookCallback<Name>
) => () => void;

export type HooksRemove = <Name extends keyof HookEnv>(
	name: Name | Name[] | MultipleHooks<Name>,
	callback?: Name extends MultipleHooks<Name> ? never : HookCallback<Name>
) => void;

export type HooksRun = <Name extends keyof HookEnv>(name: Name, env: HookEnv[Name]) => void;

export interface GrammarOptions {
	readonly getLanguage: (id: string) => Grammar;
	readonly getOptionalLanguage: (id: string) => Grammar | undefined;
	readonly extend: (id: string, ref: GrammarTokens) => Grammar;
}

// Overload for when base is required
export interface GrammarOptionsWithBase extends GrammarOptions {
	readonly base: Grammar;
}

export interface ComponentProtoBase<Id extends string = string> {
	id: Id;
	require?: ComponentProto | readonly ComponentProto[];
	optional?: string | readonly string[];
	alias?: string | readonly string[];
	effect?: (Prism: Prism & { plugins: Record<KebabToCamelCase<Id>, {}> }) => () => void;
}

// For languages that extend a base language
export interface LanguageProtoWithBase<Id extends string = string> extends ComponentProtoBase<Id> {
	grammar: Grammar | ((options: GrammarOptionsWithBase) => Grammar);
	plugin?: undefined;
	base: LanguageProto; // Required base
}

// For languages that don't extend a base language
export interface LanguageProtoWithoutBase<Id extends string = string>
	extends ComponentProtoBase<Id> {
	grammar: Grammar | ((options: GrammarOptions) => Grammar);
	plugin?: undefined;
	base?: never; // Explicitly no base allowed
}

// Union type that allows TypeScript to discriminate
export type LanguageProto<Id extends string = string> =
	| LanguageProtoWithBase<Id>
	| LanguageProtoWithoutBase<Id>;

type PluginType<Name extends string> = unknown;
export interface PluginProto<Id extends string = string> extends ComponentProtoBase<Id> {
	grammar?: undefined;
	plugin?: (
		Prism: Prism & { plugins: Record<KebabToCamelCase<Id>, undefined> }
	) => PluginType<KebabToCamelCase<Id>> & {};
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
	| 'url';

export type TokenName = (string & {}) | StandardTokenName;

/**
 * A token stream is an array of strings and {@link Token Token} objects.
 *
 * Token streams have to fulfill a few properties that are assumed by most functions (mostly internal ones) that process
 * them.
 *
 * 1. No adjacent strings.
 * 2. No empty strings.
 *
 * The only exception here is the token stream that only contains the empty string and nothing else.
 */
export type TokenStream = (string | Token)[];

export type TokenStack = [number, Token][];

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
	Record<TokenName, RegExpLike | GrammarToken | (RegExpLike | GrammarToken)[]>
>;

export type GrammarSpecial = {
	/**
	 * An optional grammar object that will be appended to this grammar.
	 */
	$rest?: Grammar | string | null;
	$tokenize?: (code: string, grammar: Grammar, Prism: Prism) => TokenStream;
};

export type Grammar = GrammarTokens & GrammarSpecial;

export interface PlainObject {
	[key: string]: unknown;
}

export type KebabToCamelCase<S extends string> = S extends `${infer T}-${infer U}`
	? `${T}${Capitalize<KebabToCamelCase<U>>}`
	: S;
