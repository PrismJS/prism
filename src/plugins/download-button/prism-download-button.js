import { noop } from '../../shared/util.js';
import toolbar from '../toolbar/prism-toolbar.js';

export default /** @type {import("../../types").PluginProto} */ ({
	id: 'download-button',
	require: toolbar,
	plugin(Prism) {
		return {}; // TODO:
	},
	effect(Prism) {
		if (typeof document === undefined) {
			return noop;
		}

		Prism.plugins.toolbar.registerButton('download-file', (env) => {
			const pre = env.element.parentNode;
			if (!pre || !/pre/i.test(pre.nodeName) || !pre.hasAttribute('data-src') || !pre.hasAttribute('data-download-link')) {
				return;
			}
			const src = pre.getAttribute('data-src');
			const a = document.createElement('a');
			a.textContent = pre.getAttribute('data-download-link-label') || 'Download';
			a.setAttribute('download', '');
			a.href = src;
			return a;
		});
	}
});
