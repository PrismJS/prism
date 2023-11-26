import { playwrightLauncher } from '@web/test-runner-playwright';

/**
 * @type {import("@web/test-runner").TestRunnerConfig}
 */
export default {
	nodeResolve: true,
	concurrency: 10,
    browsers: [
    	playwrightLauncher({
    		product: 'chromium',
      		createBrowserContext({ browser }) {
        		return browser.newContext({ permissions: ["clipboard-read", "clipboard-write"] });
      		},
    	})
    	// playwrightLauncher({ product: 'webkit' }),
    	// playwrightLauncher({ product: 'firefox' }),
  	],
}