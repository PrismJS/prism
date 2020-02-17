const fs = require('fs');
const { assert } = require('chai');
// use the JSON file because this file is less susceptible to merge conflicts
const { languages } = require('../components.json');
const PrismLoader = require('./helper/prism-loader');


describe('Examples', function () {

	const exampleFiles = new Set(fs.readdirSync(__dirname + '/../examples'));
	const ignore = new Set([
		// these are libraries and not languages
		'markup-templating',
		't4-templating',
		// this does alter some languages but it's mainly a library
		'javadoclike',
		// Regex doesn't have any classes supported by our themes and mainly extends other languages
		'regex'
	]);
	const validFiles = new Set();

	/** @type {string[]} */
	const missing = [];
	for (const lang in languages) {
		if (lang === 'meta') {
			continue;
		}

		const file = `prism-${lang}.html`;
		if (!exampleFiles.has(file)) {
			if (!ignore.has(lang)) {
				missing.push(lang);
			}
		} else {
			validFiles.add(file);
		}
	}

	const superfluous = [...exampleFiles].filter(f => !validFiles.has(f));


	it('- should be available for every language', function () {
		assert.isEmpty(missing, 'Following languages do not have an example file in ./examples/\n'
			+ missing.join('\n'));
	});

	it('- should only be available for registered languages', function () {
		assert.isEmpty(superfluous, 'Following files are not associated with any language\n'
			+ superfluous.map(f => `./examples/${f}`).join('\n'));
	});

	describe('Validate HTML templates', function () {

		const Prism = PrismLoader.createInstance(['markup']);

		function stringify(token) {
			if (typeof token === 'string') {
				return token;
			} else if (Array.isArray(token)) {
				return token.map(t => stringify(t)).join('');
			} else {
				return token.content ? stringify(token.content) : '';
			}
		}

		function validateHTML(html) {
			const tokens = Prism.tokenize(html, Prism.languages.markup);

			for (const token of tokens) {
				if (typeof token === 'string') {
					// strings cannot contain "<"
					if (/[<]/.test(token)) {
						return false;
					}
				} else if (token.type === 'tag') {
					// Tag names have to be "nice" names.
					// This is because sometimes, through luck, a "<" will find a ">" and form a tag.

					// tag tokens have the following structure:
					// ["tag", [
					//     ["tag", [
					//         ["punctuation", "</"],
					//         ["namespace", "foo:"],
					//         "name"
					//     ]],
					//     ...
					// ]]
					const tagName = stringify(token.content[0]).replace(/<\/?/, '');
					if (!/^(?!(?:html|head|body|title)$)[a-z][a-z\d]*$/.test(tagName)) {
						return false;
					}
				}
			}

			return true;
		}

		for (const file of validFiles) {
			it('- ./examples/' + file, function () {
				const content = fs.readFileSync(__dirname + '/../examples/' + file, 'utf-8');
				assert.isTrue(validateHTML(content));
			});
		}

	});

});
