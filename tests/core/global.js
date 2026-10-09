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

	// A page can load the IIFE build and then import Prism as a module
	it('should reuse the instance of the IIFE build', async () => {
		const result = await runFixture('iife-reused');

		assert.deepStrictEqual(result, { reused: true, registered: true });
	});

	it('should not highlight the page again after the IIFE build', async () => {
		const { highlightAllRuns } = await runFixture('iife-highlighted-once');

		assert.strictEqual(highlightAllRuns, 0);
	});
});
