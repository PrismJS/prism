import ComponentRegistry, { type ComponentProtoBase } from './registry';
import type { KebabToCamelCase, Prism } from '../../types';

export default class PluginRegistry extends ComponentRegistry<PluginProto> {}

export interface PluginProto<Id extends string = string> extends ComponentProtoBase<Id> {
	grammar?: undefined;
	plugin?: (Prism: Prism & { plugins: Record<KebabToCamelCase<Id>, undefined> }) => {};
}
