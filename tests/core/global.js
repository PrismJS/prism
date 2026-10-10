import { assert } from 'chai';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

/**
 * Runs a fixture in a fresh process: the global instance is created once per module graph.
 *
 * @param {string} name
 * @param {...string} args
 */
async function runFixture (name, ...args) {
	const file = new URL(`../fixtures/global-instance/${name}.js`, import.meta.url);
	const { stdout } = await promisify(execFile)(process.execPath, [fileURLToPath(file), ...args]);
	return JSON.parse(stdout);
}

describe('Global instance', () => {
	// Languages and plugins can be imported before or after the global instance exists
	it('should get components added before it exists', async () => {
		const { registered } = await runFixture('added-before');

		assert.isTrue(registered);
	});

	it('should get components added after it exists', async () => {
		const { registered } = await runFixture('added-after');

		assert.isTrue(registered);
	});

	// A page can load the IIFE build and then import Prism as a module.
	// Unbuilt source (`dev`) matches any version, e.g. a source checkout next to a dist build
	for (const [module, iife] of [['2.0.0', '2.1.0'], ['dev', '3.0.0'], ['3.0.0', 'dev']]) {
		it(`should reuse the instance of the IIFE build (module ${module}, IIFE ${iife})`, async () => {
			const result = await runFixture('iife-reused', module, iife);

			assert.deepStrictEqual(result, { reused: true, registered: true });
		});
	}

	// A later copy takes the registry of the IIFE build from the global, and the IIFE build already subscribed it.
	// A second listener would call `register()` twice for every new language or plugin
	it('should not subscribe the registry of the IIFE build again', async () => {
		const result = await runFixture('iife-registry-shared');

		assert.deepStrictEqual(result, { shared: true, listeners: 1 });
	});

	it('should not highlight the page again after the IIFE build', async () => {
		const { highlightAllRuns } = await runFixture('iife-highlighted-once');

		assert.strictEqual(highlightAllRuns, 0);
	});

	// Either build can load first. Here the module build does, e.g. before a `defer` IIFE build or one a widget adds later
	it('should share its instance and registry with later copies of Prism', async () => {
		const result = await runFixture('module-first');

		assert.deepStrictEqual(result, { published: true, shared: true, registered: true });
	});

	// Without a page, no other copy of Prism can need the instance
	it('should not set the global variable without a page', async () => {
		const { global } = await runFixture('no-page');

		assert.isFalse(global);
	});

	// Two major versions can't share an instance, but each still works on its own
	it('should create its own instance next to another major version', async () => {
		const result = await runFixture('other-major');

		assert.deepStrictEqual(result, { reused: false, kept: true, warnings: 1 });
	});
});
