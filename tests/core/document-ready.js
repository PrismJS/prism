import { assert } from 'chai';
import { documentReady } from '../../src/util/async.js';

/**
 * A document in the "interactive" state, as a module script sees it.
 *
 * @param {object} performance the window's navigation timing, if any
 */
function interactiveDocument (performance) {
	return /** @type {Document} */ (
		/** @type {unknown} */ (
			Object.assign(new EventTarget(), {
				readyState: 'interactive',
				defaultView: { performance },
			})
		)
	);
}

/**
 * @param {Promise<unknown>} promise
 */
function isSettled (promise) {
	return Promise.race([
		promise.then(() => true),
		new Promise(resolve => setTimeout(() => resolve(false), 10)),
	]);
}

describe('documentReady', () => {
	it('should wait for DOMContentLoaded after a module script, as plugins loaded next may still be on their way', async () => {
		const document = interactiveDocument({
			getEntriesByType: () => [{ domContentLoadedEventStart: 0 }],
		});
		const ready = documentReady(document);

		assert.isFalse(await isSettled(ready));

		document.dispatchEvent(new Event('DOMContentLoaded'));
		assert.isTrue(await isSettled(ready));
	});

	it('should not wait for a DOMContentLoaded that has already fired', async () => {
		const document = interactiveDocument({
			getEntriesByType: () => [{ domContentLoadedEventStart: 42 }],
		});

		assert.isTrue(await isSettled(documentReady(document)));
	});

	it('should not wait in an "interactive" document without navigation timing (jsdom), where DOMContentLoaded may have fired', async () => {
		const document = interactiveDocument({});

		assert.isTrue(await isSettled(documentReady(document)));
	});
});
