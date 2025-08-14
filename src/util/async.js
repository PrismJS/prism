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
