import { getParentPre } from '../../shared/dom-util.js';
import toolbar from '../toolbar/prism-toolbar.js';
import { knownTitles } from './title-data.js';

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

			/**
			 * Tries to guess the name of a language given its id.
			 *
			 * @param {string} id The language id.
			 * @returns {string}
			 */
			function guessTitle(id) {
				if (!id) {
					return id;
				}
				return (id.substring(0, 1).toUpperCase() + id.substring(1)).replace(/s(?=cript)/, 'S');
			}

			const language = pre.getAttribute('data-language') || knownTitles[env.language] || guessTitle(env.language);

			if (!language) {
				return;
			}
			const element = document.createElement('span');
			element.textContent = language;

			return element;
		});
	}
});
