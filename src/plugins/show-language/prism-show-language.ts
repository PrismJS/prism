import { getParentPre } from '../../shared/dom-util';
import { getTitle } from '../../shared/meta/title-data';
import { PluginProto } from '../../types';
import toolbar from '../toolbar/prism-toolbar';

export default {
	id: 'show-language',
	require: toolbar,
	effect(Prism) {
		const toolbar = Prism.plugins.toolbar!;

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
