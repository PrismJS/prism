import { noop } from '../../shared/util.js';
import toolbar from '../toolbar/prism-toolbar.js';

export default /** @type {import("../../types").PluginProto} */ ({
	id: 'download-button',
	require: toolbar,
	effect(Prism) {
		if (typeof document === 'undefined') {
			return noop;
		}

		const toolbar = /** @type {import('../toolbar/prism-toolbar.js').Toolbar} */(Prism.plugins.toolbar);

		toolbar.registerButton('download-file', (env) => {
			const pre = env.element.parentElement;
			if (!pre || !/pre/i.test(pre.nodeName)) {
				return;
			}

			const src = pre.getAttribute('data-src') || pre.getAttribute('data-download-link');
			if (!src) {
				return;
			}

			const a = document.createElement('a');
			a.textContent = pre.getAttribute('data-download-link-label') || 'Download';
			a.setAttribute('download', '');
			a.href = src;
			return a;
		});
	}
});
