import { getParentPre } from '../../shared/dom-util';
import { getTitle } from '../../shared/meta/title-data';
import toolbar from '../toolbar/prism-toolbar';

export default /** @type {import("../../types").PluginProto<'show-language'>} */ ({
	id: 'show-language',
	require: toolbar,
	effect(Prism) {
		const toolbar = /** @type {import('../toolbar/prism-toolbar.js').Toolbar} */(Prism.plugins.toolbar);

		return toolbar.registerButton('show-language', (env) => {
			const pre = getParentPre(env.element);
			if (!pre) {
				return;
			}

			const title = pre.getAttribute('data-language') || getTitle(env.language);
			if (!title) {
				return;
			}

			const element = document.createElement('span');
			element.textContent = title;
			return element;
		});
	}
});
