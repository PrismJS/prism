var components = require('../components.js');

function getOptionallyDependents(mainLanguage) {
	return Object.keys(components.languages).filter(function (language) {
		if (language === 'meta') {
			return false;
		}
		if (components.languages[language].optionalDependencies) {
			var optionalDependencies = components.languages[language].optionalDependencies;
			if (!Array.isArray(optionalDependencies)) {
				optionalDependencies = [optionalDependencies];
			}
			if (optionalDependencies.indexOf(mainLanguage) !== -1) {
				return true;
			}
		}
		return false;
	});
}

function loadLanguages(arr, withoutDependencies) {
	// If no argument is passed, load all components
	if (!arr) {
		arr = Object.keys(components.languages).filter(function (language) {
			return language !== 'meta';
		});
	}
	if (arr && !arr.length) {
		return;
	}

	if (!Array.isArray(arr)) {
		arr = [arr];
	}

	arr.forEach(function (language) {
		if (components.languages[language]) {
			// Load dependencies first
			if (!withoutDependencies && components.languages[language].require) {
				loadLanguages(components.languages[language].require);
			}

			var pathToLanguage = './prism-' + language;
			delete require.cache[require.resolve(pathToLanguage)];
			delete Prism.languages[language];
			require(pathToLanguage);

			// Reload dependents
			var dependents = getOptionallyDependents(language);
			dependents = dependents.filter(function (dependent) {
				// If dependent language was already loaded,
				// we want to reload it.
				if (Prism.languages[dependent]) {
					delete Prism.languages[dependent];
					return true;
				}
				return false;
			});
			if (dependents.length) {
				loadLanguages(dependents, true);
			}
		}
	});
}

module.exports = loadLanguages;