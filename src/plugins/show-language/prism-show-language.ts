import { getParentPre } from '../../shared/dom-util';
import { getTitle } from '../../shared/meta/title-data';
import toolbar from '../toolbar/prism-toolbar';
import type { PluginProto } from '../../types';
import type { Toolbar } from '../toolbar/prism-toolbar';

export default {
	id: 'show-language',
	require: toolbar,
	effect(Prism) {
		const toolbar = Prism.plugins.toolbar as Toolbar;

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
} as PluginProto<'show-language'>;
