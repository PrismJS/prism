import type { HookCallback, HookEnvMap, Hooks } from '../core/hooks';

/**
 * Returns a single function that calls all the given functions.
 */
export function combineCallbacks(...callbacks: (() => void)[]): () => void {
	return () => {
		for (const callback of callbacks) {
			callback();
		}
	};
}

/**
 * TODO: Add description
 */
export function addHooks(hooks: Hooks, hooksMap: { [K in keyof HookEnvMap]?: HookCallback<K> }) {
	const callbacks = [];

	for (const name in hooksMap) {
		if (Object.hasOwnProperty.call(hooksMap, name)) {
			const hook = hooksMap[name as keyof HookEnvMap];
			if (hook) {
				callbacks.push(hooks.add(name as never, hook as never));
			}
		}
	}

	return combineCallbacks(...callbacks);
}
