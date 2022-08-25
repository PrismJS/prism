export class Hooks {
	constructor() {
		/**
		 * @type {Map<string, ((env: any) => void)[]>}
		 * @private
		 */
		this._all = new Map();
	}

	/**
	 * Adds the given callback to the list of callbacks for the given hook and returns a function that
	 * removes the hook again when called.
	 *
	 * The callback will be invoked when the hook it is registered for is run.
	 * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
	 *
	 * One callback function can be registered to multiple hooks.
	 *
	 * A callback function must not be registered for the same hook multiple times. Doing so will cause
	 * undefined behavior. However, registering a callback again after removing it is fine.
	 *
	 * @param {Name} name The name of the hook.
	 * @param {import("./hooks-env").HookCallback<Name>} callback The callback function which is given environment variables.
	 * @returns {() => void}
	 * @template {string} Name
	 * @public
	 */
	add(name, callback) {
		let hooks = this._all.get(name);
		if (hooks === undefined) {
			hooks = [];
			this._all.set(name, hooks);
		}
		const list = hooks;

		list.push(callback);

		return () => {
			const index = list.indexOf(callback);
			if (index !== -1) {
				list.splice(index, 1);
			}
		};
	}

	/**
	 * Runs a hook invoking all registered callbacks with the given environment variables.
	 *
	 * Callbacks will be invoked synchronously and in the order in which they were registered.
	 *
	 * @param {Name} name The name of the hook.
	 * @param {import("./hooks-env").HookEnv<Name>} env The environment variables of the hook passed to all callbacks registered.
	 * @template {string} Name
	 * @public
	 */
	run(name, env) {
		const callbacks = this._all.get(name);

		if (!callbacks || !callbacks.length) {
			return;
		}

		for (const callback of callbacks) {
			callback(env);
		}
	}
}
