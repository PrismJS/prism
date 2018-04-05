var components = require('../components.js');

function loadLanguages(arr) {
	// If no argument is passed, load all components
	if (!arr) {
		arr = Object.keys(components.languages).filter(function (lang) {
			return lang !== 'meta';
		});
	}

	if (!Array.isArray(arr)) {
		arr = [arr];
	}
	arr.forEach(function(language) {
		// Load dependencies first
		if (components.languages[language] && components.languages[language].require) {
			loadLanguages(components.languages[language].require);
		}

		require('./prism-' + language);
	});
}

module.exports = loadLanguages;