"use strict";

const { assert } = require("chai");
const PrismLoader = require('./helper/prism-loader');
const { languages } = require('./../components');

const ignoreKeys = Object.keys(PrismLoader.createEmptyPrism().languages);

function toArray(value) {
	if (Array.isArray(value)) {
		return value;
	} else if (value === undefined) {
		return [];
	} else {
		return [value];
	}
}

for (const lang in languages) {
	if (lang === 'meta') {
		continue;
	}

	describe(`Testing language aliases of '${lang}'`, function () {

		if (languages[lang].aliasTitles) {
			it('- should have all alias titles registered as alias', function () {
				var aliases = new Set(toArray(languages[lang].alias));

				Object.keys(languages[lang].aliasTitles).forEach(id => {
					if (!aliases.has(id)) {
						assert.fail(`The alias '${id}' with the title ${JSON.stringify(languages[lang].aliasTitles[id])} is not registered as an alias.`);
					}
				});
			});
		}

		it('- should known all aliases', function () {

			var loadedLanguages = new Set(Object.keys(PrismLoader.createInstance(lang).languages));

			// check that all aliases are defined
			toArray(languages[lang].alias).forEach(alias => {
				assert.isTrue(loadedLanguages.has(alias), `Alias '${alias}' is not present.`);
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
				assert.fail(`There are unregistered aliases (${loadedLanguages.size}): ${JSON.stringify([...loadedLanguages])}`);
			}
		});
	});
}
