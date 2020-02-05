(function(){
	if (typeof self === 'undefined' || !self.Prism || !self.document) {
		return;
	}

	/**
	 * @callback ButtonCallback
	 * @param {any} env The environment of the "complete" hook.
	 * @returns {Element | undefined | null}
	 *
	 * @typedef ButtonOptions
	 * @property {string} text The text displayed.
	 * @property {string} [url] The URL of the link which will be created.
	 * @property {Function} [onClick] The event listener for the `click` event of the created button.
	 * @property {string} [className] The class attribute to include with element.
	 */

	/** @type {{ key: string; call: ButtonCallback }[]} */
	var callbacks = [];
	var map = {};
	var noop = function() {};

	Prism.plugins.toolbar = {};

	/**
	 * Register a button callback with the toolbar.
	 *
	 * @param {string} key
	 * @param {ButtonOptions | ButtonCallback} opts
	 */
	var registerButton = Prism.plugins.toolbar.registerButton = function (key, opts) {
		var callback;

		if (typeof opts === 'function') {
			callback = opts;
		} else {
			callback = function (env) {
				var element;

				if (typeof opts.onClick === 'function') {
					element = document.createElement('button');
					element.type = 'button';
					element.addEventListener('click', function () {
						opts.onClick.call(this, env);
					});
				} else if (typeof opts.url === 'string') {
					element = document.createElement('a');
					element.href = opts.url;
				} else {
					element = document.createElement('span');
				}

				if (opts.className) {
					element.classList.add(opts.className);
				}

				element.textContent = opts.text;

				return element;
			};
		}

		if (key in map) {
			console.warn('There is a button with the key "' + key + '" registered already.');
			return;
		}

		callbacks.push({ key: key, call: map[key] = callback });
	};

	/**
	 * Returns a list of disabled buttons.
	 *
	 * @param {HTMLElement} element
	 * @returns {{ [key: string]: true }}
	 */
	function getDisabled(element) {
		var stack = [];
		while (element) {
			stack.push(element);
			element = element.parentElement;
		}

		/** @type {{ [key: string]: true }} */
		var disabled = {};
		for (var i = stack.length - 1; i >= 0; i--) {
			var e = stack[i];
			var toDisable = e.getAttribute('data-toolbar-disable');
			if (toDisable) {
				toDisable.split(/\s*,\s*/g).forEach(function (key) {
					if (key === '*') {
						Object.keys(map).forEach(function (key) {
							disabled[key] = true;
						});
					} else {
						disabled[key] = true;
					}
				});
			}
			var toEnable = e.getAttribute('data-toolbar-enable');
			if (toEnable) {
				toEnable.split(/\s*,\s*/g).forEach(function (key) {
					if (key === '*') {
						disabled = {};
					} else {
						delete disabled[key];
					}
				});
			}
		}

		return disabled;
	}

	/**
	 * Post-highlight Prism hook callback.
	 *
	 * @param env
	 */
	var hook = Prism.plugins.toolbar.hook = function (env) {
		// Check if inline or actual code block (credit to line-numbers plugin)
		var pre = env.element.parentNode;
		if (!pre || !/pre/i.test(pre.nodeName)) {
			return;
		}

		// Autoloader rehighlights, so only do this once.
		if (pre.parentNode.classList.contains('code-toolbar')) {
			return;
		}

		// Create wrapper for <pre> to prevent scrolling toolbar with content
		var wrapper = document.createElement("div");
		wrapper.classList.add("code-toolbar");
		pre.parentNode.insertBefore(wrapper, pre);
		wrapper.appendChild(pre);

		// Setup the toolbar
		var toolbar = document.createElement('div');
		toolbar.classList.add('toolbar');

		var order = document.body.getAttribute('data-toolbar-order');
		if (order) {
			callbacks = order.split(/\s*,\s*/g).map(function(key) {
				return { key: key, call: map[key] || noop };
			});
		}

		var disabled = getDisabled(env.element);

		callbacks.forEach(function(callback) {
			if (callback.key in disabled) {
				return;
			}

			var element = callback.call(env);

			if (!element) {
				return;
			}

			var item = document.createElement('div');
			item.classList.add('toolbar-item');

			item.appendChild(element);
			toolbar.appendChild(item);
		});

		// Add our toolbar to the currently created wrapper of <pre> tag
		wrapper.appendChild(toolbar);
	};

	registerButton('label', function(env) {
		var pre = env.element.parentNode;
		if (!pre || !/pre/i.test(pre.nodeName)) {
			return;
		}

		if (!pre.hasAttribute('data-label')) {
			return;
		}

		var element, template;
		var text = pre.getAttribute('data-label');
		try {
			// Any normal text will blow up this selector.
			template = document.querySelector('template#' + text);
		} catch (e) {}

		if (template) {
			element = template.content;
		} else {
			if (pre.hasAttribute('data-url')) {
				element = document.createElement('a');
				element.href = pre.getAttribute('data-url');
			} else {
				element = document.createElement('span');
			}

			element.textContent = text;
		}

		return element;
	});

	/**
	 * Register the toolbar with Prism.
	 */
	Prism.hooks.add('complete', hook);
})();
