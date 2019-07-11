(function () {

	if (typeof self === 'undefined' || !self.Prism || !self.document) {
		return;
	}

	Prism.plugins.UnescapedMarkup = true;

	Prism.hooks.add('before-highlightall', function (env) {
		env.selector += ', [class*="lang-"] script[type="text/plain"], [class*="language-"] script[type="text/plain"]' +
			', script[type="text/plain"][class*="lang-"], script[type="text/plain"][class*="language-"]';
	});

	Prism.hooks.add('before-sanity-check', function (env) {
		/** @type {HTMLElement} */
		var element = env.element;

		if ((element.matches || element.msMatchesSelector).call(element, 'script[type="text/plain"]')) {
			var code = document.createElement('code');
			var pre = document.createElement('pre');

			pre.className = code.className = element.className;

			if (element.dataset) {
				Object.keys(element.dataset).forEach(function (key) {
					if (Object.prototype.hasOwnProperty.call(element.dataset, key)) {
						pre.dataset[key] = element.dataset[key];
					}
				});
			}

			code.textContent = env.code = env.code.replace(/&lt;\/script(>|&gt;)/gi, '</scri' + 'pt>');

			pre.appendChild(code);
			element.parentNode.replaceChild(pre, element);
			env.element = code;

		} else if (!env.code && (element.matches || element.msMatchesSelector).call(element, 'pre > code') &&
			element.firstChild && element.firstChild.nodeName == '#comment') {
			// <pre><code><!-- actual code --></code></pre>
			element.textContent = env.code = element.firstChild.textContent;
		}

	});
}());
