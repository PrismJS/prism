/**
 * A class for managing hooks for deep extensibility.
 * Inspired by https://www.npmjs.com/package/blissful-hooks.
 */
export class Hooks {
	/**
	 * Private internal map of hook names to arrays of callback functions.
	 *
	 * @type {HooksAll}
	 */
	_all = {};

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
	 * @type {HooksAdd}
	 * @param name Hook name(s) or a map of hook names to callbacks.
	 * @param callback The callback function which is given environment variables.
	 * @returns Function that removes the callback when called.
	 */
	add (name, callback) {
		if (Array.isArray(name)) {
			// One function, multiple hooks
			for (const n of name) {
				this.add(n, callback);
			}
		}
		else if (typeof name === 'object') {
			// Multiple hooks
			const hooks = name;

			for (const name in hooks) {
				const callback = hooks[name];
				if (callback) {
					this.add(/** @type {string} */ (name), /** @type {HookCallback} */ (callback));
				}
			}
		}
		else {
			const hooks = (this._all[name] ??= []);
			hooks.push(/** @type {never} */ (callback));
		}

		return () => {
			this.remove(name, callback);
		};
	}

	/**
	 * Removes the given callback from the list of callbacks for the given hook(s).
	 *
	 * @type {HooksRemove}
	 * @param name Hook name(s) or a map of hook names to callbacks.
	 * @param callback The callback function to remove.
	 */
	remove (name, callback) {
		if (Array.isArray(name)) {
			// Multiple hook names, same callback
			for (const n of name) {
				this.remove(n, callback);
			}
		}
		else if (typeof name === 'object') {
			// Map of hook names to callbacks
			for (const n in name) {
				this.remove(n, callback);
			}
		}
		else {
			const index = this._all[name]?.indexOf(/** @type {never} */ (callback));
			if (index > -1) {
				this._all[name].splice(index, 1);
			}
		}
	}

	/**
	 * Runs a hook invoking all registered callbacks with the given environment variables.
	 *
	 * Callbacks will be invoked synchronously and in the order in which they were registered.
	 *
	 * @type {HooksRun}
	 * @param name The name of the hook.
	 * @param env The environment variables of the hook passed to all callbacks registered.
	 */
	run (name, env) {
		const callbacks = this._all[name];
		const context = env?.this ?? env?.context ?? env;

		if (!callbacks || !callbacks.length) {
			return;
		}

		for (const callback of callbacks) {
			callback.call(context, env);
		}
	}
}

/**
 * @typedef {import('../../types.d.ts').HookCallback} HookCallback
 * @typedef {import('../../types.d.ts').HooksAll} HooksAll
 * @typedef {import('../../types.d.ts').HooksAdd} HooksAdd
 * @typedef {import('../../types.d.ts').HooksRemove} HooksRemove
 * @typedef {import('../../types.d.ts').HooksRun} HooksRun
 */
