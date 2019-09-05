const components = require('../components.js');
const getLoad = require('../dependencies');


/**
 * The set of all languages which have been loaded using the below function.
 *
 * @type {Set<string>}
 */
const loadedLanguages = new Set();

/**
 * Loads the given languages and adds them to the current Prism instance.
 *
 * @param {string|string[]} languages
 * @returns {void}
 */
function loadLanguages(languages) {
	if (!Array.isArray(languages)) {
		languages = [languages];
	}

	const loaded = [...loadedLanguages];

	// the user might have loaded languages via some other way or used `prism.js` which already includes some
	for (const lang in Prism.languages) {
		// type check because there are also some functions in Prism.languages
		if (typeof Prism.languages[lang] == 'object') {
			loaded.push(lang);
		}
	}

	getLoad(components, languages, loaded).load(lang => {
		if (!(lang in components.languages)) {
			console.warn('Language does not exist: ' + lang);
			return;
		}

		const pathToLanguage = './prism-' + lang;

		// remove from require cache and from Prism
		delete require.cache[require.resolve(pathToLanguage)];
		delete Prism.languages[lang];

		require(pathToLanguage);

		loadedLanguages.add(lang);
	});
}

module.exports = loadLanguages;
