/* global Prism, alert, document, window */

Prism.plugins.toolbar.registerButton('hello-world', {
	text: 'Hello World!', // required
	onClick: function (env) {
		// optional
		alert('This code snippet is written in ' + env.language + '.');
	},
});

Prism.plugins.toolbar.registerButton('select-code', function (env) {
	// eslint-disable-next-line no-var
	var button = document.createElement('button');
	button.innerHTML = 'Select Code';

	button.addEventListener('click', function () {
		// Source: http://stackoverflow.com/a/11128179/2757940
		if (document.body.createTextRange) {
			// ms
			// eslint-disable-next-line no-var
			var range = document.body.createTextRange();
			range.moveToElementText(env.element);
			range.select();
		} else if (window.getSelection) {
			// moz, opera, webkit
			// eslint-disable-next-line no-var
			var selection = window.getSelection();
			range = document.createRange();
			range.selectNodeContents(env.element);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	});

	return button;
});
