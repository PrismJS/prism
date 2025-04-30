export type { Prism } from './core/classes/prism';

export type {
	GrammarOptions,
	StandardTokenName,
	TokenName,
	RegExpLike,
	GrammarToken,
	GrammarTokens,
	GrammarSymbols,
	GrammarSpecial,
	Grammar,
} from './grammar';

export type { LanguageProto, LanguageLike } from './classes/language';

export type { ComponentRegistryOptions, ComponentProtoBase } from './classes/registry';

export type { PluginProto } from './classes/plugin-registry';

export type { KebabToCamelCase } from './util/types';

export type ComponentProto = LanguageProto | PluginProto;

export interface PlainObject {
	[key: string]: unknown;
}
