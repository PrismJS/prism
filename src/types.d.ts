/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import type Prism from './core/classes/prism';

export interface GrammarOptions {
	readonly getLanguage: (id: string) => Grammar;
	readonly getOptionalLanguage: (id: string) => Grammar | undefined;
	readonly extend: (id: string, ref: GrammarTokens) => Grammar;
}
export interface ComponentProtoBase<Id extends string = string> {
	id: Id;
	require?: ComponentProto | readonly ComponentProto[];
	optional?: string | readonly string[];
	alias?: string | readonly string[];
	effect?: (Prism: Prism & { plugins: Record<KebabToCamelCase<Id>, {}> }) => () => void;
}
export interface LanguageProto<Id extends string = string> extends ComponentProtoBase<Id> {
	grammar: Grammar | ((options?: GrammarOptions) => Grammar);
	plugin?: undefined;
	base?: LanguageProto;
	extends?: string | readonly string[];
}
export interface PluginProto<Id extends string = string> extends ComponentProtoBase<Id> {
	grammar?: undefined;
	plugin?: (Prism: Prism & { plugins: Record<KebabToCamelCase<Id>, undefined> }) => {};
}
export type ComponentProto = LanguageProto | PluginProto;

export type * from './classes/grammar';

export interface PlainObject {
	[key: string]: unknown;
}

export type KebabToCamelCase<S extends string> = S extends `${infer T}-${infer U}`
	? `${T}${Capitalize<KebabToCamelCase<U>>}`
	: S;
