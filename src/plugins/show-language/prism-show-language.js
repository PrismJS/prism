import prism from '../../global.js';
import { getParentPre } from '../../shared/dom-util.js';
import { getTitle } from '../../shared/meta/title-data.js';
import toolbar from '../toolbar/prism-toolbar.js';

/** @type {import('../../types.d.ts').PluginProto<'show-language'>} */
const Self = {
	id: 'show-language',
	require: toolbar,
	effect (Prism) {
		/** @type {import('../toolbar/prism-toolbar.js').Toolbar} */
		const toolbar = Prism.plugins.toolbar;

		return toolbar.registerButton('show-language', env => {
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
	},
};

export default Self;

prism.components.add(Self);
