/**
 * Returns a single function that calls all the given functions.
 *
 * @param {(() => void)[]} callbacks
 * @returns {() => void}
 */
export function combineCallbacks(...callbacks) {
	return () => {
		for (const callback of callbacks) {
			callback();
		}
	};
}

/**
 *
 * @param {import('../core/hooks').Hooks} hooks
 * @param {{ [K in keyof import('../core/hooks-env').HookEnvMap]?: import('../core/hooks-env').HookCallback<K> }} hooksMap
 */
export function addHooks(hooks, hooksMap) {
	const callbacks = [];

	for (const name in hooksMap) {
		if (Object.hasOwnProperty.call(hooksMap, name)) {
			callbacks.push(hooks.add(name, hooksMap[name]));
		}
	}

	return combineCallbacks(...callbacks);
}
