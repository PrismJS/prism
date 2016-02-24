(function(){
	if (typeof self === 'undefined' || !self.Prism || !self.document) {
		return;
	}

	if (!Prism.plugins.toolbar) {
		console.warn('Copy to Clipboard plugin loaded before Toolbar plugin.');

		return;
	}

	var Clipboard = window.Clipboard || undefined;

	if (!Clipboard && typeof require === 'function') {
		Clipboard = require('clipboard');
	}

	if (!Clipboard) {
		console.warn('Clipboard.js not loaded.');

		return;
	}

	Prism.plugins.toolbar.registerButton(function (env) {
		var linkCopy = document.createElement('a');
		linkCopy.innerHTML = 'Copy';

		var clip = new Clipboard(linkCopy, {
			'text': function () {
				return env.code;
			}
		});

		clip.on('success', function() {
			linkCopy.innerHTML = 'Copied!';

			resetText();
		});
		clip.on('error', function () {
			linkCopy.innerHTML = 'Press Ctrl+C to copy';

			resetText();
		});

		return linkCopy;

		function resetText() {
			setTimeout(function () {
				linkCopy.innerHTML = 'Copy';
			}, 5000);
		}
	});
})();
