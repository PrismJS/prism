import ComponentRegistry, { type ComponentRegistryOptions } from './registry';
import type { PluginProto } from '../../types';

export default class PluginRegistry extends ComponentRegistry<PluginProto> {
	constructor (options: ComponentRegistryOptions) {
		super(options);
	}
}
