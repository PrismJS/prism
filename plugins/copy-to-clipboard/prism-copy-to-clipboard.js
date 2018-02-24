var textCopy = 'Copy', textCopied = 'Copied!', errorCopy = 'Press Ctrl+C to copy';

(function(){
	if (typeof self === 'undefined' || !self.Prism || !self.document) {
		return;
	}

	if (!Prism.plugins.toolbar) {
		console.warn('Copy to Clipboard plugin loaded before Toolbar plugin.');

		return;
	}

	var Clipboard = window.Clipboard || undefined;

	if (Clipboard && /(native code)/.test(Clipboard.toString())) {
		Clipboard = undefined;
	}

	if (!Clipboard && typeof require === 'function') {
		Clipboard = require('clipboard');
	}

	var callbacks = [];

	if (!Clipboard) {
		var script = document.createElement('script');
		var head = document.querySelector('head');

		script.onload = function() {
			Clipboard = window.Clipboard;

			if (Clipboard) {
				while (callbacks.length) {
					callbacks.pop()();
				}
			}
		};

		script.src = 'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js';
		head.appendChild(script);
	}

	Prism.plugins.toolbar.registerButton('copy-to-clipboard', function (env) {
		var linkCopy = document.createElement('a');
		linkCopy.textContent = textCopy;

		if (!Clipboard) {
			callbacks.push(registerClipboard);
		} else {
			registerClipboard();
		}

		return linkCopy;

		function registerClipboard() {
			var clip = new Clipboard(linkCopy, {
				'text': function () {
					return env.code;
				}
			});

			clip.on('success', function() {
				linkCopy.textContent = textCopied;

				resetText();
			});
			clip.on('error', function () {
				linkCopy.textContent = errorCopy;

				resetText();
			});
		}

		function resetText() {
			setTimeout(function () {
				linkCopy.textContent = textCopy;
			}, 5000);
		}
	});
})();
