"use strict";

const { assert } = require("chai");
const PrismLoader = require('./helper/prism-loader');
const { languages } = require('../components');

for (const lang in languages) {
	if (lang === 'meta') {
		continue;
	}

	describe(`Testing regular expressions of '${lang}'`, function () {

		const Prism = PrismLoader.createInstance(lang);

		it('- should not match the empty string', function () {
			let lastToken = '<unknown>';

			Prism.languages.DFS(Prism.languages, function (name, value) {
				if (typeof this === 'object' && !Array.isArray(this) && name !== 'pattern') {
					lastToken = name;
				}

				if (Prism.util.type(value) === 'RegExp') {
					assert.notMatch('', value, `Token '${lastToken}': ${value} should not match the empty string.`);
				}
			});

		});
	});
}
