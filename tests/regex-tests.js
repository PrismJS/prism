"use strict";

const { assert } = require('chai');
const PrismLoader = require('./helper/prism-loader');
const { languages } = require('../components');


for (const lang in languages) {
	if (lang === 'meta') {
		continue;
	}

	describe(`Testing regular expressions of '${lang}'`, function () {

		const Prism = PrismLoader.createInstance(lang);

		/**
		 * Invokes the given function on every pattern in `Prism.languages`.
		 *
		 * @param {(values: { pattern: RegExp, tokenName: string, name: string, parent: any }) => void} callback
		 */
		function forEachPattern(callback) {
			/** @type {Map<string, string>} */
			const nameMap = new Map();

			Prism.languages.DFS(Prism.languages, function (name, value) {
				let path = nameMap.get(this) || '<languages>';
				if (/^\d+$/.test(name)) {
					path += `[${name}]`;
				} else if (/^[a-z]\w*$/i.test(name)) {
					path += `.${name}`;
				} else {
					path += `[${JSON.stringify(name)}]`;
				}
				if (Array.isArray(value) || Prism.util.type(value) === 'Object') {
					nameMap.set(value, path);
				}

				if (Prism.util.type(value) === 'RegExp') {
					callback({
						pattern: value,
						tokenName: path,
						name,
						parent: this,
					});
				}
			});
		}


		it('- should not match the empty string', function () {
			forEachPattern(({ pattern, tokenName }) => {
				// test for empty string
				assert.notMatch('', pattern, `Token ${tokenName}: ${pattern} should not match the empty string.`);
			});
		});

		it('- should have a capturing group if lookbehind is set to true', function () {
			forEachPattern(({ pattern, tokenName, name, parent }) => {
				if (name === 'pattern' && parent.lookbehind) {
					const simplifiedSource = pattern.source.replace(/\\\D/g, '_').replace(/\[[^\]]*\]/g, '_');

					if (!/\((?!\?)/.test(simplifiedSource)) {
						assert.fail(`Token ${tokenName}: The pattern is set to 'lookbehind: true' but does not have a capturing group.`);
					}
				}
			});
		});
	});
}
