'use strict';

const { assert } = require('chai');
const PrismLoader = require('./helper/prism-loader');
const { languages } = require('./../components.json');


function toArray(value) {
	if (Array.isArray(value)) {
		return value;
	} else if (value === undefined) {
		return [];
	}
	return [value];
}

// the keys of Prism.languages without any loaded languages (basically just a few functions)
const ignoreKeys = Object.keys(PrismLoader.createEmptyPrism().languages);


for (const lang in languages) {
	if (lang === 'meta') {
		continue;
	}

	describe(`Testing language aliases of '${lang}'`, function () {

		if (languages[lang].aliasTitles) {
			it('- should have all alias titles registered as alias', function () {
				let aliases = new Set(toArray(languages[lang].alias));

				Object.keys(languages[lang].aliasTitles).forEach(id => {
					if (!aliases.has(id)) {
						const titleJson = JSON.stringify(languages[lang].aliasTitles[id]);
						assert.fail(`The alias '${id}' with the title ${titleJson} is not registered as an alias.`);
					}
				});
			});
		}

		it('- should known all aliases', function () {

			let loadedLanguages = new Set(Object.keys(PrismLoader.createInstance(lang).languages));

			// check that all aliases are defined
			toArray(languages[lang].alias).forEach(alias => {
				assert.isTrue(loadedLanguages.has(alias), `The registered alias '${alias}' is not present.`);
			});


			// remove ignore keys
			ignoreKeys.forEach(x => loadedLanguages.delete(x));

			// remove language, aliases, and requirements
			function remove(lang) {
				loadedLanguages.delete(lang);
				toArray(languages[lang].alias).forEach(alias => loadedLanguages.delete(alias));

				// remove recursively
				toArray(languages[lang].require).forEach(id => remove(id));
			}
			remove(lang);


			// there should be nothing left
			if (loadedLanguages.size > 0) {
				const unregisteredAliases = `(${loadedLanguages.size}) ${JSON.stringify([...loadedLanguages])}`;
				assert.fail(`There are unregistered aliases: ${unregisteredAliases}`);
			}
		});
	});
}
