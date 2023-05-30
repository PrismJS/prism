import { addHooks } from '../../shared/hooks-util';
import type { PluginProto } from '../../types';

export default {
	id: 'unescaped-markup',
	effect(Prism) {
		return addHooks(Prism.hooks, {
			'before-highlightall': (env) => {
				env.selector += ', [class*="lang-"] script[type="text/plain"]'
					+ ', [class*="language-"] script[type="text/plain"]'
					+ ', script[type="text/plain"][class*="lang-"]'
					+ ', script[type="text/plain"][class*="language-"]';
			},
			'before-sanity-check': (env) => {
				const element = env.element as HTMLElement;

				if (element.matches('script[type="text/plain"]')) {
					// found a <script type="text/plain" ...> element
					// we convert this element to a regular <pre><code> code block

					const code = document.createElement('code');
					const pre = document.createElement('pre');

					// copy class name
					pre.className = code.className = element.className;

					// copy all "data-" attributes
					const dataset = element.dataset;
					Object.keys(dataset || {}).forEach((key) => {
						if (Object.prototype.hasOwnProperty.call(dataset, key)) {
							pre.dataset[key] = dataset[key];
						}
					});

					code.textContent = env.code = env.code.replace(/&lt;\/script(?:>|&gt;)/gi, '</scri' + 'pt>');

					// change DOM
					pre.appendChild(code);
					element.replaceWith(pre);
					env.element = code;
					return;
				}

				if (!env.code) {
					// no code
					const childNodes = element.childNodes;
					if (childNodes.length === 1 && childNodes[0].nodeName === '#comment') {
						// the only child is a comment -> use the comment's text
						element.textContent = env.code = childNodes[0].textContent || '';
					}
				}
			}
		});
	}
} as PluginProto<'unescaped-markup'>;
