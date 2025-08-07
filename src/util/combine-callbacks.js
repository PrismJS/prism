/**
 * Returns a single function that calls all the given functions.
 *
 * @param {...function(): void} callbacks
 * @returns {function(): void}
 */
export function combineCallbacks (...callbacks) {
	return () => {
		for (const callback of callbacks) {
			callback();
		}
	};
}
