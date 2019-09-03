"use strict";

const { assert } = require("chai");
const PrismLoader = require('./helper/prism-loader');
const { languages } = require('../components');


/**
 * Performs a breadth-first search on the given start element.
 *
 * @param {any} start
 * @param {(path: { key: string, value: any }[]) => void} callback
 */
function BFS(start, callback) {
	const visited = new Set();
	/** @type {{ key: string, value: any }[][]} */
	let toVisit = [
		[{ key: null, value: start }]
	];

	callback(toVisit[0]);

	while (toVisit.length > 0) {
		/** @type {{ key: string, value: any }[][]} */
		const newToVisit = [];

		for (const path of toVisit) {
			const obj = path[path.length - 1].value;
			if (!visited.has(obj)) {
				visited.add(obj);

				for (const key in obj) {
					const value = obj[key];

					path.push({ key, value });
					callback(path);

					if (Array.isArray(value) || Object.prototype.toString.call(value) == '[object Object]') {
						newToVisit.push([...path]);
					}

					path.pop();
				}
			}
		}

		toVisit = newToVisit;
	}
}


for (const lang in languages) {
	if (lang === 'meta') {
		continue;
	}

	describe(`Patterns of '${lang}'`, function () {

		const Prism = PrismLoader.createInstance(lang);

		/**
		 * Invokes the given function on every pattern in `Prism.languages`.
		 *
		 * @param {(values: { pattern: RegExp, tokenPath: string, name: string, parent: any, path: { key: string, value: any }[] }) => void} callback
		 */
		function forEachPattern(callback) {
			BFS(Prism.languages, path => {
				const { key, value } = path[path.length - 1];

				let tokenPath = '<languages>';
				for (const { key } of path) {
					if (!key) {
						// do nothing
					} else if (/^\d+$/.test(key)) {
						tokenPath += `[${key}]`;
					} else if (/^[a-z]\w*$/i.test(key)) {
						tokenPath += `.${key}`;
					} else {
						tokenPath += `[${JSON.stringify(key)}]`;
					}
				}

				if (Object.prototype.toString.call(value) == '[object RegExp]') {
					callback({
						pattern: value,
						tokenPath,
						name: key,
						parent: path.length > 1 ? path[path.length - 2].value : undefined,
						path,
					});
				}
			});
		}


		it('- should not match the empty string', function () {
			forEachPattern(({ pattern, tokenPath }) => {
				// test for empty string
				assert.notMatch('', pattern, `Token ${tokenPath}: ${pattern} should not match the empty string.`);
			});
		});

		it('- should have a capturing group if lookbehind is set to true', function () {
			forEachPattern(({ pattern, tokenPath, name, parent }) => {
				if (name === 'pattern' && parent.lookbehind) {
					const simplifiedSource = pattern.source.replace(/\\\D/g, '_').replace(/\[[^\]]*\]/g, '_');

					if (!/\((?!\?)/.test(simplifiedSource)) {
						assert.fail(`Token ${tokenPath}: The pattern is set to 'lookbehind: true' but does not have a capturing group.`);
					}
				}
			});
		});

		it('- should have nice names and aliases', function () {
			const niceName = /^[a-z][a-z\d]*(?:[-_][a-z\d]+)*$/;
			function testName(name, desc = 'token name') {
				if (!niceName.test(name)) {
					assert.fail(`The ${desc} '${name}' does not match ${niceName}`);
				}
			}

			forEachPattern(({ name, parent, tokenPath, path }) => {
				// token name
				let offset = 1;
				if (name == 'pattern') { // regex can be inside an object
					offset++;
				}
				if (Array.isArray(path[path.length - 1 - offset].value)) { // regex/regex object can be inside an array
					offset++;
				}
				const patternName = path[path.length - offset].key;
				testName(patternName);

				// check alias
				if (name == 'pattern' && 'alias' in parent) {
					const alias = parent.alias;
					if (typeof alias === 'string') {
						testName(alias, `alias of '${tokenPath}'`);
					} else if (Array.isArray(alias)) {
						alias.forEach(name => testName(name, `alias of '${tokenPath}'`));
					}
				}
			});
		});
	});
}
