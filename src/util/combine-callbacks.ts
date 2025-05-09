/**
 * Returns a single function that calls all the given functions.
 */
export function combineCallbacks (...callbacks: (() => void)[]): () => void {
	return () => {
		for (const callback of callbacks) {
			callback();
		}
	};
}
