/**
 * @param {Document} [document=globalThis.document]
 * @returns {Promise<any>}
 */
export function documentReady (document = globalThis.document) {
	if (!document) {
		return Promise.reject();
	}

	const script = /** @type {HTMLScriptElement | null} */ (document.currentScript);

	// If the document state is "loading", then we'll use DOMContentLoaded.
	// If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
	// DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
	// might take longer one animation frame to execute which can create a race condition where only some plugins have
	// been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
	// See https://github.com/PrismJS/prism/issues/2102
	// See https://github.com/PrismJS/prism/issues/3535
	const readyState = document.readyState;
	if (
		readyState === 'loading' ||
		(readyState === 'interactive' && script && script.defer && !script.async)
	) {
		return new Promise(resolve => {
			document.addEventListener('DOMContentLoaded', resolve, { once: true });
		});
	}

	return Promise.resolve();
}

export function nextTick () {
	return new Promise(resolve => {
		if (typeof requestAnimationFrame === 'function') {
			requestAnimationFrame(resolve);
		}
		else if (typeof setImmediate === 'function') {
			setImmediate(resolve);
		}
		else {
			setTimeout(resolve, 0);
		}
	});
}

/**
 * In addition to waiting for all promises to settle, handle post-hoc additions/removals.
 *
 * @template T
 * @param {Promise<T>[]} promises
 * @returns {Promise<(T | null)[]>}
 */
export async function allSettled (promises) {
	return Promise.allSettled(promises).then(outcomes => {
		if (promises.length > 0 && promises.length !== outcomes.length) {
			// The list of promises changed. Return a new Promise.
			// The original promise won't resolve until the new one does.
			return allSettled(promises);
		}

		// The list of promises either empty or stayed the same.
		// Return results immediately.
		return outcomes.map(o => (o.status === 'fulfilled' ? o.value : null));
	});
}

/**
 * @template T
 * @typedef {Promise<T> & {resolve: (value: T) => void, reject: (reason?: any) => void}} DeferredPromise<T>
 *
 */

/**
 * @template T
 * @returns {DeferredPromise<T>}
 */
export function defer () {
	/**
	 * @type {DeferredPromise<T>['resolve']}
	 */
	let res;

	/**
	 * @type {DeferredPromise<T>['reject']}
	 */
	let rej;

	const promise = /** @type {DeferredPromise<T>} */ (
		new Promise((resolve, reject) => {
			res = resolve;
			rej = reject;
		})
	);

	// @ts-ignore
	promise.resolve = res;
	// @ts-ignore
	promise.reject = rej;

	return promise;
}
