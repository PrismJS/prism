(function(){
	if (typeof self === 'undefined' || !self.Prism || !self.document) {
		return;
	}

	var callbacks = [];

	Prism.plugins.toolbar = {};

	/**
	 * Register a button callback with the toolbar.
	 *
	 * @param {Object|Function} opts
	 */
	var registerButton = Prism.plugins.toolbar.registerButton = function (opts) {
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

				element.textContent = opts.text;

				return element;
			};
		}

		callbacks.push(callback);
	};

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

		pre.classList.add('code-toolbar');

		// Setup the toolbar
		var toolbar = document.createElement('div');
		toolbar.classList.add('toolbar');

		callbacks.forEach(function(callback) {
			var element = callback(env);

			if (!element) {
				return;
			}

			var item = document.createElement('div');
			item.classList.add('toolbar-item');

			item.appendChild(element);
			toolbar.appendChild(item);
		});

		// Add our toolbar to the <pre> tag
		pre.appendChild(toolbar);
	};

	registerButton(function(env) {
		var pre = env.element.parentNode;
		if (!pre || !/pre/i.test(pre.nodeName)) {
			return;
		}

		if (!pre.hasAttribute('data-label')) {
			return;
		}

		var text = pre.getAttribute('data-label');

		var element;

		if (pre.hasAttribute('data-url')) {
			element = document.createElement('a');
			element.href = pre.getAttribute('data-url');
		} else {
			element = document.createElement('span');
		}

		element.textContent = text;

		return element;
	});

	/**
	 * Register the toolbar with Prism.
	 */
	Prism.hooks.add('complete', hook);
})();
