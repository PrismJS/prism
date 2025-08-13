/**
 * Returns a single function that calls all the given functions.
 *
 * @param {...() => void} callbacks
 * @returns {() => void}
 */
export function combineCallbacks (...callbacks) {
	return () => {
		for (const callback of callbacks) {
			callback();
		}
	};
}
