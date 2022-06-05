'use strict';

const { assert } = require('chai');
const PrismLoader = require('./helper/prism-loader');
const { languages } = require('../components.json');
const TokenStreamTransformer = require('./helper/token-stream-transformer');


// This is where you can exclude a language from the identifier test.
//
// To exclude a language to the `testOptions` variable and add your language and the identifier types it should
// excluded from. All languages opt-in for all identifier types by default, so you have to explicitly disable each type
// you want to disable by setting it to `false`.
// Also add a small comment explaining why the language was excluded.
//
// The actual identifiers for all identifier types are defined in the `identifiers` variable.

/**
 * @type {Partial<Record<keyof import("../components.json")["languages"], IdentifierTestOptions>>}
 *
 * @typedef IdentifierTestOptions
 * @property {boolean} [word=true]
 * @property {boolean} [number=true]
 * @property {boolean} [template=true]
 */
const testOptions = {
	// all of these have a special syntax for tokens of the form __something__
	'asciidoc': {
		template: false
	},
	'markdown': {
		template: false
	},
	'textile': {
		template: false
	},

	'false': {
		word: false,
		template: false
	},
	// Hoon uses _ in its keywords
	'hoon': {
		word: false,
		template: false
	},

	// LilyPond doesn't tokenize based on words
	'lilypond': {
		word: false,
		number: false,
		template: false,
	},

	// Nevod uses underscore symbol as operator and allows hyphen to be part of identifier
	'nevod': {
		word: false,
		template: false,
	},

	// METAFONT has a special scheme for variable names with tags, suffixes and subscripts
	'metafont': {
		word: false,
		template: false,
	},
};

/** @type {Record<keyof IdentifierTestOptions, string[]>} */
const identifiers = {
	word: [
		'abc',
		'word',
		'foo1',
		'foo123',
		'foo123bar',
		'foo_123',
		'foo_123_bar',
	],
	number: [
		'0',
		'1',
		'9',
		'123',
		'123456789',
	],
	template: [
		'__PHP0__',
		'__LANG0__',
		'__LANG123__',
		'___PLACEHOLDER_0___',
		'___PLACEHOLDER_123___',
	],
};


// Below is the implementation of the test.
// If you only came here to exclude a language, you won't find anything below.


/** @type {Record<string, string>} */
const aliasMap = {};
for (const name in languages) {
	const element = languages[name];
	if (element.alias) {
		if (Array.isArray(element.alias)) {
			element.alias.forEach(a => {
				aliasMap[a] = name;
			});
		} else {
			aliasMap[element.alias] = name;
		}
	}
}

for (const lang in languages) {
	if (lang === 'meta') {
		continue;
	}

	describe(`Test '${lang}'`, function () {
		const Prism = PrismLoader.createInstance(lang);
		testLiterals(Prism, lang);
	});

	function toArray(value) {
		if (Array.isArray(value)) {
			return value;
		} else if (value != null) {
			return [value];
		} else {
			return [];
		}
	}

	let optional = toArray(languages[lang].optional);
	let modify = toArray(languages[lang].modify);

	if (optional.length > 0 || modify.length > 0) {
		let name = `Test '${lang}'`;
		if (optional.length > 0) {
			name += ` + optional dependencies '${optional.join("', '")}'`;
		}
		if (modify.length > 0) {
			name += ` + modify dependencies '${modify.join("', '")}'`;
		}

		describe(name, function () {
			const Prism = PrismLoader.createInstance([...optional, ...modify, lang]);
			testLiterals(Prism, lang);
		});
	}
}

/**
 * @param {string} lang
 * @returns {IdentifierTestOptions}
 */
function getOptions(lang) {
	return testOptions[aliasMap[lang] || lang] || {};
}

/**
 * @param {string | Token | (string | Token)[]} token
 * @returns {boolean}
 *
 * @typedef Token
 * @property {string} type
 * @property {string | Token | (string | Token)[]} content
 */
function isNotBroken(token) {
	if (typeof token === 'string') {
		return true;
	} else if (Array.isArray(token)) {
		return token.length === 1 && isNotBroken(token[0]);
	} else {
		return isNotBroken(token.content);
	}
}

/**
 * Tests all patterns in the given Prism instance.
 *
 * @param {any} Prism
 * @param {string} lang
 */
function testLiterals(Prism, lang) {

	/**
	 * @param {string[]} identifierElements
	 * @param {keyof IdentifierTestOptions} identifierType
	 */
	function matchNotBroken(identifierElements, identifierType) {
		for (const name in Prism.languages) {
			const grammar = Prism.languages[name];
			if (typeof grammar !== 'object') {
				continue;
			}

			const options = getOptions(name);
			if (options[identifierType] === false) {
				continue;
			}

			for (const ident of identifierElements) {
				const tokens = Prism.tokenize(ident, grammar);

				if (!isNotBroken(tokens)) {
					assert.fail(
						`${name}: Failed to tokenize the ${identifierType} '${ident}' as one or no token.\n` +
						'Actual token stream:\n\n' +
						TokenStreamTransformer.prettyprint(tokens) +
						'\n\n' +
						'How to fix this:\n' +
						'If your language failed any of the identifier tests then some patterns in your language can break identifiers. ' +
						'An identifier is broken if it is split into two different token (e.g. the identifier \'foo123\' (this could be a variable name) but \'123\' is tokenized as a number). ' +
						'This is usually a bug and means that some patterns need more boundary checking.\n' +
						'This test defines an identifier as /[A-Za-z_][A-Za-z_0-9]*/ so you can use \\b boundary assertions.\n\n' +
						'If the syntactic concept of an identifier is not applicable to your language, you can exclude your language from this test (or parts of it). ' +
						'Open \'' + __filename + '\' and follow the instructions to exclude a language. ' +
						'(This is usually not what you should do. Only very few language do not have the concept of identifiers.)'
					);
				}
			}
		}
	}


	const options = getOptions(lang);
	for (const key in identifiers) {
		const identifierType = /** @type {keyof IdentifierTestOptions} */ (key);
		const element = identifiers[identifierType];
		if (options[identifierType] !== false) {
			it(`- should not break ${identifierType} identifiers`, function () {
				matchNotBroken(element, identifierType);
			});
		}
	}
}
