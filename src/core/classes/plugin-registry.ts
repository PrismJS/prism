import ComponentRegistry from './registry';
import type { KebabToCamelCase, Prism } from '../../types';
import type { ComponentProtoBase } from './registry';

export default class PluginRegistry extends ComponentRegistry<PluginProto> {
	static type: string = 'plugin';
}

export interface PluginProto<Id extends string = string> extends ComponentProtoBase<Id> {
	grammar?: undefined;
	plugin?: (Prism: Prism & { plugins: Record<KebabToCamelCase<Id>, undefined> }) => {};
	effect?: (Prism: Prism & { plugins: Record<KebabToCamelCase<Id>, {}> }) => () => void;
}
