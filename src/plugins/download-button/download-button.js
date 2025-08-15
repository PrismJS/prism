import prism from '../../global.js';
import { getParentPre } from '../../shared/dom-util.js';
import toolbar from '../toolbar/toolbar.js';

/** @type {import('../../types.d.ts').PluginProto<'download-button'>} */
const Self = {
	id: 'download-button',
	require: toolbar,
	effect (Prism) {
		/** @type {import('../toolbar/toolbar.js').Toolbar} */
		const toolbar = Prism.plugins.toolbar;

		return toolbar.registerButton('download-file', env => {
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
	},
};

export default Self;

prism.components.add(Self);
