/**
 * A DOM element.
 * @external Element
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element}
 */

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document) {
		return;
	}

	if (!Prism.plugins.toolbar) {
		console.warn('Copy to Clipboard plugin loaded before Toolbar plugin.');

		return;
	}

	var ClipboardJS = window.ClipboardJS || undefined;

	if (!ClipboardJS && typeof require === 'function') {
		ClipboardJS = require('clipboard');
	}

	var callbacks = [];

	if (!ClipboardJS) {
		var script = document.createElement('script');
		var head = document.querySelector('head');

		script.onload = function () {
			ClipboardJS = window.ClipboardJS;

			if (ClipboardJS) {
				while (callbacks.length) {
					callbacks.pop()();
				}
			}
		};

		script.src = 'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js';
		head.appendChild(script);
	}

	/**
	 * Traverses up the DOM tree to find data attributes
	 * that override the default plugin settings.
	 * @param {external:Element} start An element to start from.
	 * @param {Object} defaults Keys and default values of settings.
	 * @param {String} defaults.copy A copy-to-clipboard message.
	 * @param {String} defaults.copy_error A copying error message.
	 * @param {String} defaults.copy_success A message for a successful copying.
	 * @param {Number} defaults.copy_timeout A time-out for a state changing, ms.
	 * @returns {Object} The plugin settings.
	 */
	function getSettings(start, defaults) {
		var prefix = 'data-prismjs-';
		var settings = {};
		for (var key in defaults) {
			var attr = prefix + key.replace(/_/g, '-');
			var element = start;
			while (element && !element.hasAttribute(attr)) {
				element = element.parentElement;
			}
			if (element !== null) {
				settings[key] = element.getAttribute(attr);
			} else {
				settings[key] = defaults[key];
			}
		}
		return settings;
	}

	Prism.plugins.toolbar.registerButton('copy-to-clipboard', function (env) {
		var defaults = {
			copy: 'Copy',
			copy_error: 'Press Ctrl+C to copy',
			copy_success: 'Copied!',
			copy_timeout: 5000
		};
		var element = env.element;
		var settings = getSettings(element, defaults);

		var linkCopy = document.createElement('button');
		linkCopy.textContent = settings.copy;
		linkCopy.setAttribute('type', 'button');

		if (!ClipboardJS) {
			callbacks.push(registerClipboard);
		} else {
			registerClipboard();
		}

		return linkCopy;

		function registerClipboard() {
			var clip = new ClipboardJS(linkCopy, {
				'text': function () {
					return element.textContent;
				}
			});

			clip.on('success', function () {
				linkCopy.textContent = settings.copy_success;

				resetText();
			});
			clip.on('error', function () {
				linkCopy.textContent = settings.copy_error;

				resetText();
			});
		}

		function resetText() {
			setTimeout(function () {
				linkCopy.textContent = settings.copy;
			}, settings.copy_timeout);
		}
	});
})();
