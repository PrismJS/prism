import { getParentPre } from '../../shared/dom-util';
import toolbar from '../toolbar/prism-toolbar';
import type { PluginProto } from '../../types';

export default {
	id: 'download-button',
	require: toolbar,
	effect(Prism) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const toolbar = Prism.plugins.toolbar!;

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
} as PluginProto<'download-button'>;
