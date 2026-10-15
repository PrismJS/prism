import { assert } from 'chai';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

/**
 * Runs a fixture in a fresh process: the global instance is created once per module graph.
 *
 * @param {string} name
 */
async function runFixture (name) {
	const file = new URL(`../fixtures/global-instance/${name}.js`, import.meta.url);
	const { stdout } = await promisify(execFile)(process.execPath, [fileURLToPath(file)]);
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

	// A page can load the IIFE build and then languages, plugins or Prism itself as modules
	it('should reuse the instance of the IIFE build', async () => {
		const result = await runFixture('iife-reused');

		assert.deepStrictEqual(result, { reused: true, registered: true });
	});

	it('should not highlight the page again after the IIFE build', async () => {
		const { highlightAllRuns } = await runFixture('iife-highlighted-once');

		assert.strictEqual(highlightAllRuns, 1);
	});

	// `prismjs/core.js` is for code that makes its own instances
	it('should not be created by the core entry', async () => {
		const result = await runFixture('core-entry');

		assert.deepStrictEqual(result, { isClass: true, created: false });
	});

	// The page configures the global instance with `data-prism-*` attributes
	it('should read the page config', async () => {
		const { global } = await runFixture('page-config');

		assert.isTrue(global);
	});

	// The page can also configure it with `window.Prism = { … }` before Prism loads, as in v1.
	// A module never sets the global variable, so the config object stays there
	it('should read the page config from the global variable', async () => {
		const result = await runFixture('window-config');

		assert.deepStrictEqual(result, { silent: true, kept: true });
	});

	// Several instances can live on one page, each with its own config
	it('should not read the page config into other instances', async () => {
		const { created } = await runFixture('page-config');

		assert.isUndefined(created);
	});

	// Prism can be a dependency of another package, so only the IIFE build may set a global variable
	it('should not set the global variable as a module', async () => {
		const { global } = await runFixture('no-global');

		assert.isFalse(global);
	});
});
