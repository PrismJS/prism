import { getParentPre } from '../../shared/dom-util.js';
import toolbar from '../toolbar/prism-toolbar.js';

export default /** @type {import("../../types").PluginProto} */ ({
	id: 'download-button',
	require: toolbar,
	effect(Prism) {
		const toolbar = /** @type {import('../toolbar/prism-toolbar.js').Toolbar} */(Prism.plugins.toolbar);

		return toolbar.registerButton('download-file', (env) => {
			const pre = getParentPre(env.element);
			if (!pre) {
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
