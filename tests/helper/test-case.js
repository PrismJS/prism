'use strict';

const fs = require('fs');
const path = require('path');
const { assert } = require('chai');
const Prettier = require('prettier');
const PrismLoader = require('./prism-loader');
const TokenStreamTransformer = require('./token-stream-transformer');

/**
 * @typedef {import("./token-stream-transformer").TokenStream} TokenStream
 * @typedef {import("../../components/prism-core.js")} Prism
 */

/**
 * @param {string[]} languages
 * @returns {Prism}
 */
const defaultCreateInstance = (languages) => PrismLoader.createInstance(languages);

/**
 * Handles parsing and printing of a test case file.
 *
 * A test case file consists of at most three parts, separated by a line of at least 10 dashes.
 * This separation line must start at the beginning of the line and consist of at least three dashes.
 *
 *     {code: the source code of the test case}
 *     ----------
 *     {expected: the expected value of the test case}
 *     ----------
 *     {description: explaining the test case}
 *
 * All parts are optional.
 *
 * If the file contains more than three parts, the remaining parts are part of the description.
 */
class TestCaseFile {
	/**
	 * @param {string} code
	 * @param {string | undefined} [expected]
	 * @param {string | undefined} [description]
	 */
	constructor(code, expected, description) {
		this.code = code;
		this.expected = expected || '';
		this.description = description || '';

		/**
		 * The end of line sequence used when printed.
		 *
		 * @type {"\n" | "\r\n"}
		 */
		this.eol = '\n';

		/**
		 * The number of the first line of `code`.
		 *
		 * @type {number}
		 */
		this.codeLineStart = NaN;
		/**
		 * The number of the first line of `expected`.
		 *
		 * @type {number}
		 */
		this.expectedLineStart = NaN;
		/**
		 * The number of the first line of `description`.
		 *
		 * @type {number}
		 */
		this.descriptionLineStart = NaN;
	}

	/**
	 * Returns the file content of the given test file.
	 *
	 * @returns {string}
	 */
	print() {
		const code = this.code.trim();
		const expected = (this.expected || '').trim();
		const description = (this.description || '').trim();

		const parts = [code];
		if (description) {
			parts.push(expected, description);
		} else if (expected) {
			parts.push(expected);
		}

		// join all parts together and normalize line ends to LF
		const content = parts
			.join('\n\n----------------------------------------------------\n\n')
			.replace(/\r\n?|\n/g, this.eol);

		return content + this.eol;
	}

	/**
	 * Writes the given test case file to disk.
	 *
	 * @param {string} filePath
	 */
	writeToFile(filePath) {
		fs.writeFileSync(filePath, this.print(), 'utf-8');
	}

	/**
	 * Parses the given file contents into a test file.
	 *
	 * The line ends of the code, expected value, and description are all normalized to CRLF.
	 *
	 * @param {string} content
	 * @returns {TestCaseFile}
	 */
	static parse(content) {
		const eol = (/\r\n|\n/.exec(content) || ['\n'])[0];

		// normalize line ends to CRLF
		content = content.replace(/\r\n?|\n/g, '\r\n');

		const parts = content.split(/^-{10,}[ \t]*$/m, 3);
		const code = parts[0] || '';
		const expected = parts[1] || '';
		const description = parts[2] || '';

		const file = new TestCaseFile(code.trim(), expected.trim(), description.trim());
		file.eol = /** @type {"\r\n" | "\n"} */ (eol);

		const codeStartSpaces = /^\s*/.exec(code)[0];
		const expectedStartSpaces = /^\s*/.exec(expected)[0];
		const descriptionStartSpaces = /^\s*/.exec(description)[0];

		const codeLineCount = code.split(/\r\n/).length;
		const expectedLineCount = expected.split(/\r\n/).length;

		file.codeLineStart = codeStartSpaces.split(/\r\n/).length;
		file.expectedLineStart = codeLineCount + expectedStartSpaces.split(/\r\n/).length;
		file.descriptionLineStart = codeLineCount + expectedLineCount + descriptionStartSpaces.split(/\r\n/).length;

		return file;
	}

	/**
	 * Reads the given test case file from disk.
	 *
	 * @param {string} filePath
	 * @returns {TestCaseFile}
	 */
	static readFromFile(filePath) {
		return TestCaseFile.parse(fs.readFileSync(filePath, 'utf8'));
	}
}

/**
 * @template T
 * @typedef Runner
 * @property {(Prism: Prism, code: string, language: string) => T} run
 * @property {(actual: T) => string} print
 * @property {(actual: T, expected: string) => boolean} isEqual
 * @property {(actual: T, expected: string, message: (firstDifference: number) => string) => void} assertEqual
 */

/**
 * @implements {Runner<TokenStream>}
 */
class TokenizeJSONRunner {
	/**
	 * @param {Prism} Prism
	 * @param {string} code
	 * @param {string} language
	 * @returns {TokenStream}
	 */
	run(Prism, code, language) {
		return tokenize(Prism, code, language);
	}
	/**
	 * @param {TokenStream} actual
	 * @returns {string}
	 */
	print(actual) {
		return TokenStreamTransformer.prettyprint(actual, '\t');
	}
	/**
	 * @param {TokenStream} actual
	 * @param {string} expected
	 * @returns {boolean}
	 */
	isEqual(actual, expected) {
		const simplifiedActual = TokenStreamTransformer.simplify(actual);
		let simplifiedExpected;
		try {
			simplifiedExpected = JSON.parse(expected);
		} catch (error) {
			return false;
		}

		return JSON.stringify(simplifiedActual) === JSON.stringify(simplifiedExpected);
	}
	/**
	 * @param {TokenStream} actual
	 * @param {string} expected
	 * @param {(firstDifference: number) => string} message
	 * @returns {void}
	 */
	assertEqual(actual, expected, message) {
		const simplifiedActual = TokenStreamTransformer.simplify(actual);
		const simplifiedExpected = JSON.parse(expected);

		const actualString = JSON.stringify(simplifiedActual);
		const expectedString = JSON.stringify(simplifiedExpected);

		const difference = firstDiff(expectedString, actualString);
		if (difference === undefined) {
			// both are equal
			return;
		}

		// The index of the first difference between the expected token stream and the actual token stream.
		// The index is in the raw expected token stream JSON of the test case.
		const diffIndex = translateIndexIgnoreSpaces(expected, expectedString, difference);

		assert.deepEqual(simplifiedActual, simplifiedExpected, message(diffIndex));
	}
}

/**
 * @implements {Runner<string>}
 */
class HighlightHTMLRunner {
	/**
	 * @param {Prism} Prism
	 * @param {string} code
	 * @param {string} language
	 * @returns {string}
	 */
	run(Prism, code, language) {
		const env = {
			element: {},
			language,
			grammar: Prism.languages[language],
			code,
		};

		Prism.hooks.run('before-highlight', env);
		env.highlightedCode = Prism.highlight(env.code, env.grammar, env.language);
		Prism.hooks.run('before-insert', env);
		env.element.innerHTML = env.highlightedCode;
		Prism.hooks.run('after-highlight', env);
		Prism.hooks.run('complete', env);

		return env.highlightedCode;
	}
	/**
	 * @param {string} actual
	 * @returns {string}
	 */
	print(actual) {
		return Prettier.format(actual, {
			printWidth: 100,
			tabWidth: 4,
			useTabs: true,
			htmlWhitespaceSensitivity: 'ignore',
			filepath: 'fake.html',
		});
	}
	/**
	 * @param {string} actual
	 * @param {string} expected
	 * @returns {boolean}
	 */
	isEqual(actual, expected) {
		return this.normalize(actual) === this.normalize(expected);
	}
	/**
	 * @param {string} actual
	 * @param {string} expected
	 * @param {(firstDifference: number) => string} message
	 * @returns {void}
	 */
	assertEqual(actual, expected, message) {
		// We don't calculate the index of the first difference because it's difficult.
		assert.deepEqual(this.normalize(actual), this.normalize(expected), message(0));
	}

	/**
	 * Normalizes the given HTML by removing all leading spaces and trailing spaces. Line breaks will also be normalized
	 * to enable good diffing.
	 *
	 * @param {string} html
	 * @returns {string}
	 */
	normalize(html) {
		return html
			.replace(/</g, '\n<')
			.replace(/>/g, '>\n')
			.replace(/[ \t]*[\r\n]\s*/g, '\n')
			.trim();
	}
}


module.exports = {
	TestCaseFile,

	/**
	 * Runs the given test file and asserts the result.
	 *
	 * This function will determine what kind of test files the given file is and call the appropriate method to run the
	 * test.
	 *
	 * @param {RunOptions} options
	 * @returns {void}
	 *
	 * @typedef RunOptions
	 * @property {string} languageIdentifier
	 * @property {string} filePath
	 * @property {"none" | "insert" | "update"} updateMode
	 * @property {(languages: string[]) => Prism} [createInstance]
	 */
	run(options) {
		if (path.extname(options.filePath) === '.test') {
			this.runTestCase(options.languageIdentifier, options.filePath, options.updateMode, options.createInstance);
		} else {
			this.runTestsWithHooks(options.languageIdentifier, require(options.filePath), options.createInstance);
		}
	},

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
	 * @param {(languages: string[]) => Prism} [createInstance]
	 */
	runTestCase(languageIdentifier, filePath, updateMode, createInstance = defaultCreateInstance) {
		let runner;
		if (/\.html\.test$/i.test(filePath)) {
			runner = new HighlightHTMLRunner();
		} else {
			runner = new TokenizeJSONRunner();
		}
		this.runTestCaseWithRunner(languageIdentifier, filePath, updateMode, runner, createInstance);
	},

	/**
	 * @param {string} languageIdentifier
	 * @param {string} filePath
	 * @param {"none" | "insert" | "update"} updateMode
	 * @param {Runner<T>} runner
	 * @param {(languages: string[]) => Prism} createInstance
	 * @template T
	 */
	runTestCaseWithRunner(languageIdentifier, filePath, updateMode, runner, createInstance) {
		const testCase = TestCaseFile.readFromFile(filePath);
		const usedLanguages = this.parseLanguageNames(languageIdentifier);

		const Prism = createInstance(usedLanguages.languages);

		// the first language is the main language to highlight
		const actualValue = runner.run(Prism, testCase.code, usedLanguages.mainLanguage);

		function updateFile() {
			// change the file
			testCase.expected = runner.print(actualValue);
			testCase.writeToFile(filePath);
		}

		if (!testCase.expected) {
			// the test case doesn't have an expected value

			if (updateMode === 'none') {
				throw new Error('This test case doesn\'t have an expected token stream.'
					+ ' Either add the JSON of a token stream or run \`npm run test:languages -- --insert\`'
					+ ' to automatically add the current token stream.');
			}

			updateFile();
		} else {
			// there is an expected value

			if (runner.isEqual(actualValue, testCase.expected)) {
				// no difference
				return;
			}

			if (updateMode === 'update') {
				updateFile();
				return;
			}

			runner.assertEqual(actualValue, testCase.expected, diffIndex => {
				const expectedLines = testCase.expected.substr(0, diffIndex).split(/\r\n?|\n/g);
				const columnNumber = expectedLines.pop().length + 1;
				const lineNumber = testCase.expectedLineStart + expectedLines.length;

				return testCase.description +
					`\nThe expected token stream differs from the actual token stream.` +
					` Either change the ${usedLanguages.mainLanguage} language or update the expected token stream.` +
					` Run \`npm run test:languages -- --update\` to update all missing or incorrect expected token streams.` +
					`\n\n\nActual Token Stream:` +
					`\n-----------------------------------------\n` +
					runner.print(actualValue) +
					`\n-----------------------------------------\n` +
					`File: ${filePath}:${lineNumber}:${columnNumber}\n\n`;
			});
		}
	},

	tokenize,


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
};

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
function tokenize(Prism, code, language) {
	const env = {
		code,
		grammar: Prism.languages[language],
		language
	};

	Prism.hooks.run('before-tokenize', env);
	env.tokens = Prism.tokenize(env.code, env.grammar);
	Prism.hooks.run('after-tokenize', env);

	return env.tokens;
}

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
