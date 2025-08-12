export interface BaseHookEnv {
	context?: object;
}
export interface HookEnv extends BaseHookEnv, Record<string, any> {}

export type HookCallback<T extends keyof HookEnv = string> = (env: HookEnv[T]) => void;

export type MultipleHooks<T extends keyof HookEnv> = { [K in T]?: HookCallback<K> };

export class Hooks {
	/**
	 * Internal map of hook names to arrays of callback functions.
	 */
	private _all: Record<keyof HookEnv, HookCallback[]>;

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
	 * @param name Hook name(s) or a map of hook names to callbacks.
	 * @param callback The callback function which is given environment variables.
	 * @returns Function that removes the callback when called.
	 */
	add<Name extends keyof HookEnv> (
		name: Name | Name[] | MultipleHooks<Name>,
		callback?: Name extends MultipleHooks<Name> ? never : HookCallback<Name>
	): () => void;

	/**
	 * Removes the given callback from the list of callbacks for the given hook(s).
	 *
	 * @param name Hook name(s) or a map of hook names to callbacks.
	 * @param callback The callback function to remove.
	 */
	remove<Name extends keyof HookEnv> (
		name: Name | Name[] | MultipleHooks<Name>,
		callback?: Name extends MultipleHooks<Name> ? never : HookCallback<Name>
	): void;

	/**
	 * Runs a hook invoking all registered callbacks with the given environment variables.
	 *
	 * Callbacks will be invoked synchronously and in the order in which they were registered.
	 *
	 * @param name The name of the hook.
	 * @param env The environment variables of the hook passed to all callbacks registered.
	 */
	run<Name extends keyof HookEnv> (name: Name, env: HookEnv[Name]): void;
}
