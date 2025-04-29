import type Prism from './core/classes/prism';
export type * from './classes/grammar';
export type * from './classes/language';
export type * from './classes/registry';
export type * from './classes/plugin-registry';
export type * from './classes/language-registry';
export type * from './util/types';

export type ComponentProto = LanguageProto | PluginProto;

export interface PlainObject {
	[key: string]: unknown;
}
