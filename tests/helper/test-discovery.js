import fs from 'fs';
import path from 'path';

const LANGUAGES_DIR = path.join(__dirname, '..', 'languages');

/**
 * Loads the list of all available tests
 *
 * @param {string} [rootDir]
 * @returns {Map<string, string[]>}
 */
export function loadAllTests(rootDir = LANGUAGES_DIR) {
	return new Map(getAllDirectories(rootDir).map(language => {
		return [language, getAllFiles(path.join(rootDir, language))];
	}));
}

/**
 * Loads the list of available tests that match the given languages
 *
 * @param {string|string[]} languages
 * @param {string} [rootDir]
 * @returns {Map<string, string[]>}
 */
export function loadSomeTests(languages, rootDir = LANGUAGES_DIR) {
	return new Map(getSomeDirectories(rootDir, languages).map(language => {
		return [language, getAllFiles(path.join(rootDir, language))];
	}));
}


/**
 * Returns a list of all (sub)directories (just the directory names, not full paths)
 * in the given src directory
 *
 * @param {string} src
 * @returns {string[]}
 */
export function getAllDirectories(src) {
	return fs.readdirSync(src).filter(file => {
		return fs.statSync(path.join(src, file)).isDirectory();
	});
}

/**
 * Returns a list of all (sub)directories (just the directory names, not full paths)
 * in the given src directory, matching the given languages
 *
 * @param {string} src
 * @param {string|string[]} languages
 * @returns {string[]}
 */
export function getSomeDirectories(src, languages) {
	return fs.readdirSync(src).filter(file => {
		return fs.statSync(path.join(src, file)).isDirectory() && directoryMatches(file, languages);
	});
}

/**
 * Returns whether a directory matches one of the given languages.
 *
 * @param {string} directory
 * @param {string|string[]} languages
 */
export function directoryMatches(directory, languages) {
	if (!Array.isArray(languages)) {
		languages = [languages];
	}
	const dirLanguages = directory.split(/!?\+!?/);
	return dirLanguages.some(lang => languages.includes(lang));
}


/**
 * Returns a list of all full file paths to all files in the given src directory
 *
 * @param {string} src
 * @returns {string[]}
 */
function getAllFiles(src) {
	return fs.readdirSync(src)
		.filter(fileName => {
			return path.extname(fileName) === '.test'
				&& fs.statSync(path.join(src, fileName)).isFile();
		})
		.map(fileName => {
			return path.join(src, fileName);
		});
}
