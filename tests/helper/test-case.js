// @ts-check

'use strict';

const fs = require('fs');
const { assert } = require('chai');
const PrismLoader = require('./prism-loader');
const TokenStreamTransformer = require('./token-stream-transformer');

/**
 * @typedef {import("./token-stream-transformer").TokenStream} TokenStream
 * @typedef {import("./token-stream-transformer").SimplifiedTokenStream} SimplifiedTokenStream
 * @typedef {import("./prism-loader").PrismLoaderContext["Prism"]} Prism
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
 */

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
function runTestCase(languageIdentifier, filePath, updateMode) {
	if (filePath.endsWith('.testhtml')) {
		runTestCaseWithRunner(languageIdentifier, filePath, updateMode, new HTMLRunner());
	} else {
		runTestCaseWithRunner(languageIdentifier, filePath, updateMode, new JSONRunner());
	}
}

/**
 * @param {string} languageIdentifier
 * @param {string} filePath
 * @param {"none" | "insert" | "update"} updateMode
 * @param {Runner<A, E>} runner
 * @template A
 * @template E
 */
function runTestCaseWithRunner(languageIdentifier, filePath, updateMode, runner) {
	const testCase = parseTestCaseFile(filePath);
	const usedLanguages = parseLanguageNames(languageIdentifier);

	const Prism = PrismLoader.createInstance(usedLanguages.languages);

	// the first language is the main language to highlight
	const actual = runner.run(Prism, testCase.code, usedLanguages.mainLanguage);

	function updateFile() {
		// change the file
		const lineEnd = (/\r\n/.test(testCase.code) || !/\n/.test(testCase.code)) ? '\r\n' : '\n';
		const separator = '\n\n----------------------------------------------------\n\n';
		const pretty = runner.format(actual, '\t');

		let content = testCase.code + separator + pretty;
		if (testCase.comment.trim()) {
			content += separator + testCase.comment.trim();
		}
		content += '\n';
		content = content.replace(/\r?\n/g, lineEnd);

		fs.writeFileSync(filePath, content, 'utf-8');
	}

	if (!testCase.expected) {
		// the test case doesn't have an expected value
		if (updateMode === 'none') {
			throw new Error('This test case doesn\'t have an expected token stream.'
				+ ' Either add the expected token stream/HTML or run \`npm run test:languages -- --update\`'
				+ ' to automatically add the current token stream.');
		}

		updateFile();
	} else {
		// there is an expected value
		const actualValue = runner.convert(actual);
		const expectedValue = runner.parse(testCase.expected);

		if (runner.areEqual(actualValue, expectedValue)) {
			// no difference
			return;
		}

		if (updateMode === 'update') {
			updateFile();
			return;
		}

		const tokenStreamStr = runner.format(actual, '    ');
		const message = `\nThe expected token stream differs from the actual token stream.` +
			` Either change the ${usedLanguages.mainLanguage} language or update the expected token stream.` +
			` Run \`npm run test:languages -- --update\` to update all missing or incorrect expected token streams.` +
			`\n\n\nActual Token Stream:` +
			`\n-----------------------------------------\n` +
			tokenStreamStr +
			`\n-----------------------------------------\n` +
			`File: ${filePath}\n\n`;

		assert.deepEqual(actualValue, expectedValue, testCase.comment + message);
	}
}

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
 * Returns the HTML of the highlighted given code.
 *
 * @param {import('../../components/prism-core')} Prism The Prism instance which will highlight `code`.
 * @param {string} code The code to highlight.
 * @param {string} language The language id.
 * @returns {string}
 */
function highlight(Prism, code, language) {
	const env = {
		element: {},
		language,
		grammar: Prism.languages[language],
		code
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
 * Parses the language names and finds the main language.
 *
 * It is either the last language or the language followed by a exclamation mark “!”.
 * There should only be one language with an exclamation mark.
 *
 * @param {string} languageIdentifier
 *
 * @returns {{languages: string[], mainLanguage: string}}
 */
function parseLanguageNames(languageIdentifier) {
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
}


/**
 * Parses the test case from the given test case file
 *
 * @private
 * @param {string} filePath
 * @returns {ParsedTestCase}
 *
 * @typedef ParsedTestCase
 * @property {string} code
 * @property {string} expected
 * @property {string} comment
 */
function parseTestCaseFile(filePath) {
	const testCaseSource = fs.readFileSync(filePath, 'utf8');
	const testCaseParts = testCaseSource.split(/^-{10,}[ \t]*$/m);

	if (testCaseParts.length > 3) {
		throw new Error('Invalid test case format: Too many sections.');
	}

	const code = testCaseParts[0].trim();
	const expected = (testCaseParts[1] || '').trim();
	const comment = (testCaseParts[2] || '').trimStart();

	const testCase = {
		code,
		expected,
		comment
	};

	return testCase;
}

/**
 * @typedef Runner
 * @property {(Prism: Prism, code: string, language: string) => Actual} run
 * @property {(input: Actual, indentation: string) => string} format
 * @property {(input: Actual) => Expected} convert
 * @property {(input: string) => Expected} parse
 * @property {(a: Expected, b: Expected) => boolean} areEqual
 * @template Actual
 * @template Expected
 */

/** @implements {Runner<TokenStream, SimplifiedTokenStream>} */
class JSONRunner {
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
	 * @param {TokenStream} tokenStream
	 * @param {string} indentation
	 * @returns {string}
	 */
	format(tokenStream, indentation) {
		return TokenStreamTransformer.prettyprint(tokenStream, indentation);
	}
	/**
	 * @param {TokenStream} input
	 * @returns {SimplifiedTokenStream}
	 */
	convert(input) {
		return TokenStreamTransformer.simplify(input);
	}
	/**
	 * @param {string} source
	 * @returns {SimplifiedTokenStream}
	 */
	parse(source) {
		return JSON.parse(source);
	}
	/**
	 * @param {SimplifiedTokenStream} a
	 * @param {SimplifiedTokenStream} b
	 * @returns {boolean}
	 */
	areEqual(a, b) {
		return JSON.stringify(a) === JSON.stringify(b);
	}
}

/** @implements {Runner<string, string>} */
class HTMLRunner {
	/**
	 * @param {Prism} Prism
	 * @param {string} code
	 * @param {string} language
	 * @returns {string}
	 */
	run(Prism, code, language) {
		return highlight(Prism, code, language);
	}
	/**
	 * @param {string} html
	 * @returns {string}
	 */
	format(html) {
		return html;
	}
	/**
	 * @param {string} input
	 * @returns {string}
	 */
	convert(input) {
		return input;
	}
	/**
	 * This won't actually parse the HTML source code. It will simple return it as is.
	 *
	 * @param {string} html
	 * @returns {string}
	 */
	parse(html) {
		return html;
	}
	/**
	 * @param {string} a
	 * @param {string} b
	 * @returns {boolean}
	 */
	areEqual(a, b) {
		return a === b;
	}
}


module.exports = { runTestCase, tokenize, highlight, parseLanguageNames, parseTestCaseFile };
