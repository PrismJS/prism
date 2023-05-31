import { getParentPre } from '../../shared/dom-util';
import { noop } from '../../shared/util';
import type { CompleteEnv, HookCallback } from '../../core/hooks';
import type { PluginProto } from '../../types';

/**
 * Returns the callback order of the given element.
 */
function getOrder(element: Element) {
	let e: Element | null = element;
	for (; e; e = e.parentElement) {
		let order = e.getAttribute('data-toolbar-order');
		if (order != null) {
			order = order.trim();
			if (order.length) {
				return order.split(/\s*,\s*/);
			} else {
				return [];
			}
		}
	}
}

export interface ButtonOptions {
	/**
	 * The text displayed.
	 */
	text: string;
	/**
	 * The URL of the link which will be created.
	 */
	url?: string;
	/**
	 * The event listener for the `click` event of the created button.
	 */
	onClick?: (env: CompleteEnv) => void;
	/**
	 * The class attribute to include with element.
	 */
	className?: string;
}
export type ButtonFactory = (env: CompleteEnv) => Node | undefined;

export class Toolbar {
	private callbacks: ButtonFactory[] = [];
	private map = new Map<string, ButtonFactory>();

	/**
	 * Register a button callback with the toolbar.
	 *
	 * The returned function will remove the added callback again when called.
	 */
	registerButton(key: string, opts: ButtonOptions | ButtonFactory): () => void {
		let callback: ButtonFactory;

		if (typeof opts === 'function') {
			callback = opts;
		} else {
			callback = function (env) {
				const { text, url, onClick, className } = opts;

				let element;
				if (typeof onClick === 'function') {
					element = document.createElement('button');
					element.type = 'button';
					element.addEventListener('click', function () {
						onClick.call(this, env);
					});
				} else if (typeof url === 'string') {
					element = document.createElement('a');
					element.href = url;
				} else {
					element = document.createElement('span');
				}

				if (className) {
					element.classList.add(className);
				}

				element.textContent = text;

				return element;
			};
		}

		if (this.map.has(key)) {
			console.warn('There is a button with the key "' + key + '" registered already.');
			return noop;
		}

		this.map.set(key, callback);
		this.callbacks.push(callback);

		return () => {
			this.map.delete(key);
			const index = this.callbacks.indexOf(callback);
			if (index !== -1) {
				this.callbacks.splice(index, 1);
			}
		};
	}

	/**
	 * @package
	 */
	hook: HookCallback<'complete'> = (env) => {
		// Check if inline or actual code block (credit to line-numbers plugin)
		const pre = getParentPre(env.element);
		if (!pre) {
			return;
		}

		const container = pre.parentElement;
		if (!container) {
			return;
		}

		// Autoloader rehighlights, so only do this once.
		if (container.classList.contains('code-toolbar')) {
			return;
		}

		// Create wrapper for <pre> to prevent scrolling toolbar with content
		const wrapper = document.createElement('div');
		wrapper.classList.add('code-toolbar');
		container.insertBefore(wrapper, pre);
		wrapper.appendChild(pre);

		// Setup the toolbar
		const toolbar = document.createElement('div');
		toolbar.classList.add('toolbar');

		// order callbacks
		let elementCallbacks = this.callbacks;
		const order = getOrder(env.element);
		if (order) {
			elementCallbacks = order.map((key) => this.map.get(key) || noop);
		}

		elementCallbacks.forEach((callback) => {
			const element = callback(env);

			if (!element) {
				return;
			}

			const item = document.createElement('div');
			item.classList.add('toolbar-item');

			item.appendChild(element);
			toolbar.appendChild(item);
		});

		// Add our toolbar to the currently created wrapper of <pre> tag
		wrapper.appendChild(toolbar);
	};
}

const label: ButtonFactory = (env) => {
	const pre = getParentPre(env.element);
	if (!pre) {
		return;
	}

	if (!pre.hasAttribute('data-label')) {
		return;
	}

	let element;
	let template;
	const text = pre.getAttribute('data-label');
	try {
		// Any normal text will blow up this selector.
		if (text) {
			template = document.querySelector('template#' + text);
		}
	} catch (e) { /* noop */ }

	if (template) {
		element = (template as HTMLTemplateElement).content;
	} else {
		const url = pre.getAttribute('data-url');
		if (url) {
			element = document.createElement('a');
			element.href = url;
		} else {
			element = document.createElement('span');
		}

		element.textContent = text;
	}

	return element;
};

export default {
	id: 'toolbar',
	plugin() {
		const toolbar = new Toolbar();
		toolbar.registerButton('label', label);
		return toolbar;
	},
	effect(Prism) {
		return Prism.hooks.add('complete', Prism.plugins.toolbar.hook);
	}
} as PluginProto<'toolbar'>;
