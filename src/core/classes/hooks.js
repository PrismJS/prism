/**
 * A class for managing hooks for deep extensibility.
 * Inspired by https://www.npmjs.com/package/blissful-hooks.
 */
export class Hooks {
	/**
	 * Internal map of hook names to arrays of callback functions.
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

			for (const hookName in hooks) {
				const hookCallback = hooks[hookName];
				if (hookCallback) {
					this.add(hookName, hookCallback);
				}
			}
		}
		else {
			const hooks = (this._all[name] ??= []);
			hooks.push(callback);
		}

		return () => {
			this.remove(name, callback);
		};
	}

	/**
	 * Removes the given callback from the list of callbacks for the given hook(s).
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
			const index = this._all[name]?.indexOf(callback);
			if (index > -1) {
				this._all[name].splice(index, 1);
			}
		}
	}

	/**
	 * Runs a hook invoking all registered callbacks with the given environment variables.
	 *
	 * Callbacks will be invoked synchronously and in the order in which they were registered.
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
