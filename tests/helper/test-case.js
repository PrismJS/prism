'use strict';

const fs = require('fs');
const { assert } = require('chai');
const PrismLoader = require('./prism-loader');
const TokenStreamTransformer = require('./token-stream-transformer');

/**
 * @typedef {import("./token-stream-transformer").TokenStream} TokenStream
 */

/**
 * Handles parsing of a test case file.
 *
 *
 * A test case file consists of at least two parts, separated by a line of dashes.
 * This separation line must start at the beginning of the line and consist of at least three dashes.
 *
 * The test case file can either consist of two parts:
 *
 *     {source code}
 *     ----
 *     {expected token stream}
 *
 *
 * or of three parts:
 *
 *     {source code}
 *     ----
 *     {expected token stream}
 *     ----
 *     {text comment explaining the test case}
 *
 * If the file contains more than three parts, the remaining parts are just ignored.
 * If the file however does not contain at least two parts (so no expected token stream),
 * the test case will later be marked as failed.
 *
 *
 */
module.exports = {

	/**
	 * Runs the given test case file and asserts the result
	 *
	 * The passed language identifier can either be a language like "css" or a composed language
	 * identifier like "css+markup". Composed identifiers can be used for testing language inclusion.
	 *
	 * When testing language inclusion, the first given language is the main language which will be passed
	 * to Prism for highlighting ("css+markup" will result in a call to Prism to highlight with the "css" grammar).
	 * But it will be ensured, that the additional passed languages will be loaded too.
	 *
	 * The languages will be loaded in the order they were provided.
	 *
	 * @param {string} languageIdentifier
	 * @param {string} filePath
	 * @param {"none" | "insert" | "update"} updateMode
	 */
	runTestCase(languageIdentifier, filePath, updateMode) {
		const testCase = this.parseTestCaseFile(filePath);
		const usedLanguages = this.parseLanguageNames(languageIdentifier);

		const Prism = PrismLoader.createInstance(usedLanguages.languages);

		// the first language is the main language to highlight
		const tokenStream = this.tokenize(Prism, testCase.code, usedLanguages.mainLanguage);

		function updateFile() {
			// change the file
			const separator = '\n\n----------------------------------------------------\n\n';
			const pretty = TokenStreamTransformer.prettyprint(tokenStream, '\t');

			let content = testCase.code + separator + pretty;
			if (testCase.comment.trim()) {
				content += separator + testCase.comment.trim();
			}
			content += '\n';

			// convert line ends to the line ends of the file
			content = content.replace(/\r\n?|\n/g, testCase.lineEndOnDisk);

			fs.writeFileSync(filePath, content, 'utf-8');
		}

		if (testCase.expectedTokenStream === null) {
			// the test case doesn't have an expected value
			if (updateMode === 'none') {
				throw new Error('This test case doesn\'t have an expected token stream.'
					+ ' Either add the JSON of a token stream or run \`npm run test:languages -- --insert\`'
					+ ' to automatically add the current token stream.');
			}

			updateFile();
		} else {
			// there is an expected value
			const simplifiedTokenStream = TokenStreamTransformer.simplify(tokenStream);

			const actual = JSON.stringify(simplifiedTokenStream);
			const expected = JSON.stringify(testCase.expectedTokenStream);

			if (actual === expected) {
				// no difference
				return;
			}

			if (updateMode === 'update') {
				updateFile();
				return;
			}

			// The index of the first difference between the expected token stream and the actual token stream.
			// The index is in the raw expected token stream JSON of the test case.
			const diffIndex = translateIndexIgnoreSpaces(testCase.expectedJson, expected, firstDiff(expected, actual));
			const expectedJsonLines = testCase.expectedJson.substr(0, diffIndex).split(/\r\n?|\n/g);
			const columnNumber = expectedJsonLines.pop().length + 1;
			const lineNumber = testCase.expectedLineOffset + expectedJsonLines.length;

			const tokenStreamStr = TokenStreamTransformer.prettyprint(tokenStream);
			const message = `\nThe expected token stream differs from the actual token stream.` +
				` Either change the ${usedLanguages.mainLanguage} language or update the expected token stream.` +
				` Run \`npm run test:languages -- --update\` to update all missing or incorrect expected token streams.` +
				`\n\n\nActual Token Stream:` +
				`\n-----------------------------------------\n` +
				tokenStreamStr +
				`\n-----------------------------------------\n` +
				`File: ${filePath}:${lineNumber}:${columnNumber}\n\n`;

			assert.deepEqual(simplifiedTokenStream, testCase.expectedTokenStream, testCase.comment + message);
		}
	},

	/**
	 * Returns the token stream of the given code highlighted with `language`.
	 *
	 * The `before-tokenize` and `after-tokenize` hooks will also be executed.
	 *
	 * @param {import('../../components/prism-core')} Prism The Prism instance which will tokenize `code`.
	 * @param {string} code The code to tokenize.
	 * @param {string} language The language id.
	 * @returns {TokenStream}
	 */
	tokenize(Prism, code, language) {
		const env = {
			code,
			grammar: Prism.languages[language],
			language
		};

		Prism.hooks.run('before-tokenize', env);
		env.tokens = Prism.tokenize(env.code, env.grammar);
		Prism.hooks.run('after-tokenize', env);

		return env.tokens;
	},


	/**
	 * Parses the language names and finds the main language.
	 *
	 * It is either the last language or the language followed by a exclamation mark “!”.
	 * There should only be one language with an exclamation mark.
	 *
	 * @param {string} languageIdentifier
	 *
	 * @returns {{languages: string[], mainLanguage: string}}
	 */
	parseLanguageNames(languageIdentifier) {
		let languages = languageIdentifier.split('+');
		let mainLanguage = null;

		languages = languages.map(
			function (language) {
				const pos = language.indexOf('!');

				if (-1 < pos) {
					if (mainLanguage) {
						throw 'There are multiple main languages defined.';
					}

					mainLanguage = language.replace('!', '');
					return mainLanguage;
				}

				return language;
			}
		);

		if (!mainLanguage) {
			mainLanguage = languages[languages.length - 1];
		}

		return {
			languages: languages,
			mainLanguage: mainLanguage
		};
	},


	/**
	 * Parses the test case from the given test case file
	 *
	 * @private
	 * @param {string} filePath
	 * @returns {ParsedTestCase}
	 *
	 * @typedef ParsedTestCase
	 * @property {string} lineEndOnDisk The EOL format used by the parsed file.
	 * @property {string} code
	 * @property {string} expectedJson
	 * @property {number} expectedLineOffset
	 * @property {Array | null} expectedTokenStream
	 * @property {string} comment
	 */
	parseTestCaseFile(filePath) {
		let testCaseSource = fs.readFileSync(filePath, 'utf8');
		const lineEndOnDisk = (/\r\n?|\n/.exec(testCaseSource) || ['\n'])[0];
		// normalize line ends to \r\n
		testCaseSource = testCaseSource.replace(/\r\n?|\n/g, '\r\n');

		const testCaseParts = testCaseSource.split(/^-{10,}[ \t]*$/m);

		if (testCaseParts.length > 3) {
			throw new Error('Invalid test case format: Too many sections.');
		}

		const code = testCaseParts[0].trim();
		const expected = (testCaseParts[1] || '').trim();
		const comment = (testCaseParts[2] || '').trimStart();

		const testCase = {
			lineEndOnDisk,
			code,
			expectedJson: expected,
			expectedLineOffset: code.split(/\r\n/g).length,
			expectedTokenStream: expected ? JSON.parse(expected) : null,
			comment
		};

		return testCase;
	},

	/**
	 * Runs the given pieces of codes and asserts their result.
	 *
	 * Code is provided as the key and expected result as the value.
	 *
	 * @param {string} languageIdentifier
	 * @param {object} codes
	 */
	runTestsWithHooks(languageIdentifier, codes) {
		const usedLanguages = this.parseLanguageNames(languageIdentifier);
		const Prism = PrismLoader.createInstance(usedLanguages.languages);
		// the first language is the main language to highlight

		for (const code in codes) {
			if (codes.hasOwnProperty(code)) {
				const env = {
					element: {},
					language: usedLanguages.mainLanguage,
					grammar: Prism.languages[usedLanguages.mainLanguage],
					code: code
				};
				Prism.hooks.run('before-highlight', env);
				env.highlightedCode = Prism.highlight(env.code, env.grammar, env.language);
				Prism.hooks.run('before-insert', env);
				env.element.innerHTML = env.highlightedCode;
				Prism.hooks.run('after-highlight', env);
				Prism.hooks.run('complete', env);
				assert.equal(env.highlightedCode, codes[code]);
			}
		}
	}
};

/**
 * Returns the index at which the given expected string differs from the given actual string.
 *
 * This will returns `undefined` if the strings are equal.
 *
 * @param {string} expected
 * @param {string} actual
 * @returns {number | undefined}
 */
function firstDiff(expected, actual) {
	let i = 0;
	let j = 0;
	while (i < expected.length && j < actual.length) {
		if (expected[i] !== actual[j]) {
			return i;
		}
		i++; j++;
	}

	if (i == expected.length && j == actual.length) {
		return undefined;
	}
	return i;
}

/**
 * Translates an index within a string (`withoutSpaces`) to the index of another string (`spacey`) where the only
 * difference between the two strings is that the other string can have any number of additional white spaces at any
 * position.
 *
 * In out use case, the `withoutSpaces` string is an unformatted JSON string and the `spacey` string is a formatted JSON
 * string.
 *
 * @param {string} spacey
 * @param {string} withoutSpaces
 * @param {number} withoutSpaceIndex
 * @returns {number | undefined}
 */
function translateIndexIgnoreSpaces(spacey, withoutSpaces, withoutSpaceIndex) {
	let i = 0;
	let j = 0;
	while (i < spacey.length && j < withoutSpaces.length) {
		while (spacey[i] !== withoutSpaces[j]) {
			i++;
		}
		if (j === withoutSpaceIndex) {
			return i;
		}
		i++; j++;
	}
	return undefined;
}
