import ComponentRegistry from './component-registry.js';
import Plugin from './plugin.js';

export default class PluginRegistry extends ComponentRegistry {
	static type = 'plugin';

	/** @type {Plugins} */
	instances = {};

	/** @type {WeakMap<PluginProto, Plugin>} */
	defs = new WeakMap();

	/**
	 * Add a plugin definition to the registry.
	 *
	 * @param {PluginProto} def
	 * @returns {boolean}
	 */
	add (def) {
		const added = super.add(def);

		if (added) {
			const plugin = new Plugin(def, this);

			this.defs.set(def, plugin);
			this.instances[def.id] = plugin;

			plugin.effect?.(this.prism);
		}

		return added;
	}

	/**
	 * Get plugin, plugin definition or null if it doesn't exist.
	 *
	 * @param {string | Plugin | PluginProto} ref Plugin id or definition
	 * @returns {Plugin | null}
	 * @throws {Error} If the argument type is invalid
	 */
	peek (ref) {
		if (ref instanceof Plugin) {
			return ref;
		}

		if (typeof ref === 'object') {
			return this.defs.get(ref) ?? null;
		}
		else if (typeof ref === 'string') {
			return this.instances[ref] ?? null;
		}
		else {
			throw new Error(`Invalid argument type: ${ref}`);
		}
	}
}

/** @import { PluginProto, Plugins } from '../../types.d.ts'; */
