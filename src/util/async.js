/**
 * @param {Document} [document=globalThis.document]
 * @returns {Promise<any>}
 */
export function documentReady (document = globalThis.document) {
	if (!document) {
		return Promise.reject();
	}

	// Deferred and module scripts run in document order after the document turns "interactive",
	// and only then DOMContentLoaded fires. Highlighting earlier races the plugins and languages still on their way.
	// Navigation timing tells whether DOMContentLoaded has already fired, e.g. for a Prism imported after it.
	// DOM emulations for Node, like jsdom, have no getEntriesByType
	// and stay "interactive" after DOMContentLoaded, so there only "loading" waits.
	// See https://github.com/PrismJS/prism/issues/2102
	// See https://github.com/PrismJS/prism/issues/3535
	const navigation = /** @type {PerformanceNavigationTiming | undefined} */ (
		document.defaultView?.performance.getEntriesByType?.('navigation')[0]
	);
	if (navigation ? !navigation.domContentLoadedEventStart : document.readyState === 'loading') {
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
 * @typedef {Promise<T> & {resolve: (value: T) => void, reject: (reason?: any) => void}} DeferredPromise
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
