import ComponentRegistry from './component-registry.js';
import Plugin from './plugin.js';

/** @type {WeakMap<Plugin, () => void>} */
const effectCleanups = new WeakMap();

/**
 * @param {PluginProto} def
 * @param {string} id
 * @returns {boolean}
 */
function optionalDependsOn (def, id) {
	const optional = def.optional;
	if (typeof optional === 'string') {
		return optional === id;
	}
	return Array.isArray(optional) && optional.includes(id);
}

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

			this.#runEffect(plugin);
			// Optional dependents may already have registered hooks. Re-run them so those
			// hooks run after this plugin.
			this.#rerunOptionalDependents(def.id);
		}

		return added;
	}

	/**
	 * @param {Plugin} plugin
	 */
	#runEffect (plugin) {
		effectCleanups.get(plugin)?.();

		const cleanup = plugin.effect?.(this.prism);
		if (typeof cleanup === 'function') {
			effectCleanups.set(plugin, cleanup);
		}
		else {
			effectCleanups.delete(plugin);
		}
	}

	/**
	 * Re-run effects of plugins that list `id` as optional, then plugins that depend on those.
	 *
	 * @param {string} id
	 * @param {Set<string>} [seen]
	 */
	#rerunOptionalDependents (id, seen = new Set()) {
		for (const other of Object.values(this.instances)) {
			if (other.id === id || seen.has(other.id) || !optionalDependsOn(other.def, id)) {
				continue;
			}

			seen.add(other.id);
			this.#runEffect(other);
			this.#rerunOptionalDependents(other.id, seen);
		}
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
