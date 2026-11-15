import List from './list.js';

export default class Plugin extends EventTarget {
	/** @type {PluginProto} */
	def;

	/** @type {PluginRegistry} */
	registry;

	/** @type {List<ComponentProto>} */
	require = new List();

	/**
	 * @param {PluginProto} def
	 * @param {PluginRegistry} registry
	 */
	constructor (def, registry) {
		super();
		this.def = def;
		this.registry = registry;

		if (this.def.require) {
			this.require.addAll(this.def.require);
		}

		for (const def of this.require) {
			// Ensure all required plugins and languages are registered
			if (def.grammar) {
				// We have a language definition
				this.registry.prism.languageRegistry.add(def);
			}
			else {
				this.registry.add(def);
			}
		}
	}

	get id () {
		return this.def.id;
	}

	get plugin () {
		if (!this.def.plugin) {
			return null;
		}

		// This will replace the getter with a writable property
		return (this.plugin = this.def.plugin(this.registry.prism));
	}

	set plugin (value) {
		Object.defineProperty(this, 'plugin', { value, writable: true });
	}

	get effect () {
		return this.def.effect;
	}
}

/** @import {ComponentProto, PluginProto, PluginRegistry} from '../../types.d.ts'; */
