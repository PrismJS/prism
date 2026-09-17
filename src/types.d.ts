import type { Language } from './core/classes/language.js';
import type { Plugin } from './core/classes/plugin.js';
import type { Token } from './core/classes/token.js';
import type { Prism } from './core/prism.js';

export type { LanguageRegistry } from './core/language-registry.js';

export type { Language };
export type Languages = Record<string, Language>;
export type LanguageGrammars = Record<string, Grammar>;

export type { PluginRegistry } from './core/plugin-registry.js';

export type { Plugin };
export type Plugins = Record<string, Plugin>;

export interface PrismConfig {
	manual?: boolean;
	silent?: boolean;
	errorHandler?: (reason: any) => PromiseLike<never>;
	plugins?: string[];
	languages?: string[];
	pluginPath?: string;
	languagePath?: string;
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
	readonly getOptionalLanguage: (id: string) => Grammar | undefined;
	readonly extend: (id: string, ref: GrammarTokens) => Grammar;
	readonly whenDefined: (id: string) => Promise<ComponentProto>;
}

export interface ComponentProtoBase<Id extends string = string> {
	id: Id;
	require?: ComponentProto | readonly ComponentProto[];
	optional?: string | readonly string[];
	alias?: string | readonly string[];
	effect?: (Prism: Prism & { plugins: Record<KebabToCamelCase<Id>, {}> }) => () => void;
}

export type LanguageProto<Id extends string = string> =
	| LanguageProtoPlain<Id>
	| LanguageProtoWithBase<Id>
	| LanguageProtoWithRequire<Id>
	| LanguageProtoWithBaseAndRequire<Id>;

interface LanguageProtoBase<Id extends string = string> extends ComponentProtoBase<Id> {
	plugin?: undefined;
	/**
	 * Marks this language as a meta-language that embeds or produces another language and can be
	 * used with a compound id (`outer:inner`, e.g. `diff:css`, `django:css`, `diff:django:css`).
	 *
	 * A definition is the default inner language (e.g. `markup` for templating languages);
	 * `null` means there is no default (e.g. `diff`). Use `:none` to explicitly opt out of a default.
	 *
	 * By default, everything that is not a token of this grammar is highlighted as the inner language.
	 * The grammar can select other parts instead with `$inner: { select }` (e.g. `diff` selects the
	 * lines of its blocks, without their prefixes).
	 */
	inner?: LanguageProto | null;
}

interface LanguageProtoPlain<Id extends string = string> extends LanguageProtoBase<Id> {
	grammar: Grammar | ((options: GrammarOptions) => Grammar);
	base?: never; // Explicitly no base allowed
	require?: never; // Explicitly no require allowed
}

interface LanguageProtoWithBase<Id extends string = string> extends LanguageProtoBase<Id> {
	grammar: Grammar | ((options: GrammarOptions & { readonly base: Grammar }) => Grammar);
	base: LanguageProto; // Required base
	require?: never; // Explicitly no require allowed
}

interface LanguageProtoWithRequire<Id extends string = string> extends LanguageProtoBase<Id> {
	grammar:
		| Grammar
		| ((options: GrammarOptions & { readonly languages: Record<string, Grammar> }) => Grammar);
	base?: never; // Explicitly no base allowed
	require: ComponentProto | readonly ComponentProto[]; // Required require
}

interface LanguageProtoWithBaseAndRequire<Id extends string = string>
	extends LanguageProtoBase<Id> {
	grammar:
		| Grammar
		| ((
				options: GrammarOptions & {
					readonly base: Grammar;
					readonly languages: Record<string, Grammar>;
				}
		  ) => Grammar);
	base: LanguageProto; // Required base
	require: ComponentProto | readonly ComponentProto[]; // Required require
}

type PluginType<Name extends string> = unknown;
export interface PluginProto<Id extends string = string> extends ComponentProtoBase<Id> {
	grammar?: undefined;
	inner?: undefined;
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
	/**
	 * An inner language for parts of the tokenized code.
	 *
	 * After tokenizing with this grammar, the selected parts of the result are concatenated,
	 * tokenized as one whole with the inner language, and the resulting tokens are put back where
	 * the parts were. By default the unmatched text is selected: this is how templating languages
	 * embed their host language. `{ select }` selects other containers, e.g. the lines of a diff.
	 *
	 * A grammar reference alone is shorthand for `{ language }`. An inline grammar is told apart
	 * from the object form by its keys, so one whose only token is named `language` has to be
	 * referenced by id or from a function instead.
	 */
	$inner?: GrammarRef | InnerSpec;
	$tokenize?: (code: string, grammar: Grammar, Prism: Prism) => TokenStream;
};

/**
 * A reference to a grammar: a language id, a grammar object, or a function returning one.
 */
export type GrammarRef = Grammar | string | (() => Grammar) | null | undefined;

export interface InnerSpec {
	/**
	 * The inner language. Defaults to the inner language of the meta-language instance
	 * (see `LanguageProtoBase.inner`).
	 */
	language?: GrammarRef;
	/**
	 * One selector per document. A selector is a comma-separated list of containers: token names
	 * (matching a token's type or alias) and `:text` for the unmatched text. The strings directly
	 * inside the selected containers are concatenated and highlighted as one whole. With several
	 * selectors, this happens once per selector, later ones winning where they overlap.
	 *
	 * A selector that names no container at all is an error. A name that no token has is not:
	 * it simply selects nothing, since a document need not contain every kind of container.
	 *
	 * @default ':text'
	 */
	select?: string | string[];
}

/**
 * Tokens within $insert
 */
export type InsertableToken = (RegExpLike | GrammarToken | (RegExpLike | GrammarToken)[]) & {
	$before?: TokenName | TokenName[];
	$after?: TokenName | TokenName[];
};

/**
 * A grammar that is defined as its delta from another grammar.
 */
export type GrammarPatch = {
	$insert?: Partial<Record<TokenName, InsertableToken>>;
	$insertBefore?: Partial<Record<TokenName, GrammarTokens>>;
	$insertAfter?: Partial<Record<TokenName, GrammarTokens>>;
	$delete?: TokenName[];
	$merge?: Partial<
		Record<TokenName, Partial<Omit<GrammarToken, 'pattern'>> & { pattern?: RegExpLike }>
	>;
};

export interface Grammar extends GrammarSpecial, GrammarPatch {
	[token: string]:
		| RegExpLike
		| GrammarToken
		| (RegExpLike | GrammarToken)[]
		| GrammarSpecial[keyof GrammarSpecial]
		| GrammarPatch[keyof GrammarPatch];
}

export interface PlainObject {
	[key: string]: unknown;
}

export type KebabToCamelCase<S extends string> = S extends `${infer T}-${infer U}`
	? `${T}${Capitalize<KebabToCamelCase<U>>}`
	: S;
