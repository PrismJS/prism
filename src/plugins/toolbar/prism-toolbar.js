import { getParentPre } from '../../shared/dom-util.js';
import { noop } from '../../shared/util.js';

/**
 * Returns the callback order of the given element.
 *
 * @param {Element} element
 * @returns {string[] | undefined}
 */
function getOrder(element) {
	/** @type {Element | null} */
	let e = element;
	for (; e; e = e.parentElement) {
		let order = e.getAttribute('data-toolbar-order');
		if (order != null) {
			order = order.trim();
			if (order.length) {
				return order.split(/\s*,\s*/g);
			} else {
				return [];
			}
		}
	}
}

/**
 * @typedef ButtonOptions
 * @property {string} text The text displayed.
 * @property {string} [url] The URL of the link which will be created.
 * @property {(env: import('../../core/hooks-env.js').CompleteEnv) => void} [onClick] The event listener for the `click` event of the created button.
 * @property {string} [className] The class attribute to include with element.
 */
/**
 * @typedef {(env: import('../../core/hooks-env.js').CompleteEnv) => Node | undefined} ButtonFactory
 */

export class Toolbar {
	constructor() {
		/**
		 * @type {ButtonFactory[]}
		 * @private
		 */
		this.callbacks = [];
		/**
		 * @type {Map<string, ButtonFactory>}
		 * @private
		 */
		this.map = new Map();
	}

	/**
	 * Register a button callback with the toolbar.
	 *
	 * @param {string} key
	 * @param {ButtonOptions | ButtonFactory} opts
	 */
	registerButton(key, opts) {
		/** @type {ButtonFactory} */
		let callback;

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
			return;
		}

		this.map.set(key, callback);
		this.callbacks.push(callback);
	}

	/**
	 * @type {import('../../core/hooks-env.js').HookCallback<"complete">}
	 * @package
	 */
	hook = (env) => {
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

/** @type {ButtonFactory} */
const label = (env) => {
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
		template = document.querySelector('template#' + text);
	} catch (e) { /* noop */ }

	if (template) {
		element = /** @type {HTMLTemplateElement} */(template).content;
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

export default /** @type {import("../../types").PluginProto} */ ({
	id: 'toolbar',
	plugin() {
		const toolbar = new Toolbar();
		toolbar.registerButton('label', label);
		return toolbar;
	},
	effect(Prism) {
		const toolbar = /** @type {Toolbar} */ (Prism.plugins.toolbar);

		return Prism.hooks.add('complete', toolbar.hook);
	}
});
