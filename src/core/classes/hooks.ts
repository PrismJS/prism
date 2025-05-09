/**
 * A class for managing hooks for deep extensibility.
 * Inspired https://www.npmjs.com/package/blissful-hooks
 */
export class Hooks {
	private _all: Record<keyof HookEnv, HookCallback[]> = {};

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
	 * @param name The name of the hook.
	 * @param callback The callback function which is given environment variables.
	 */
	add<Name extends keyof HookEnv> (
		name: Name | Name[] | MultipleHooks<Name>,
		callback?: Name extends MultipleHooks<Name> ? never : HookCallback<Name>
	): () => void {
		if (Array.isArray(name)) {
			// One function, multiple hooks
			for (let n of name) {
				this.add(n, callback);
			}
		}
		else if (typeof name === 'object') {
			// Multiple hooks
			let hooks = name;

			for (let name in hooks) {
				this.add(name, hooks[name as string]);
			}
		}
		else {
			let hooks = (this._all[name] ??= []);
			hooks.push(callback as never);
		}

		return () => {
			this.remove(name, callback);
		};
	}

	remove<Name extends keyof HookEnv> (
		name: Name | Name[] | MultipleHooks<Name>,
		callback?: Name extends MultipleHooks<Name> ? never : HookCallback<Name>
	): void {
		if (Array.isArray(name)) {
			// Multiple hook names, same callback
			for (let n of name) {
				this.remove(n, callback);
			}
		}
		else if (typeof name === 'object') {
			// Map of hook names to callbacks
			for (let n in name) {
				this.remove(n, callback);
			}
		}
		else {
			const index = this._all[name]?.indexOf(callback as never);
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
	 * @param name The name of the hook.
	 * @param env The environment variables of the hook passed to all callbacks registered.
	 */
	run<Name extends keyof HookEnv> (name: Name, env: HookEnv[Name]): void {
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

export interface BaseHookEnv {
	context?: object;
}
export interface HookEnv extends BaseHookEnv, Record<string, any> {}

export type HookCallback<T extends keyof HookEnv = string> = (env: HookEnv[T]) => void;

export type MultipleHooks<T extends keyof HookEnv> = { [K in T]?: HookCallback<K> };
