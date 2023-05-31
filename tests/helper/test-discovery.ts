import fs from 'fs';
import path from 'path';

const LANGUAGES_DIR = path.join(__dirname, '..', 'languages');

/**
 * Loads the list of all available tests
 */
export function loadAllTests(rootDir = LANGUAGES_DIR): Map<string, string[]> {
	return new Map(getAllDirectories(rootDir).map((language) => {
		return [language, getAllFiles(path.join(rootDir, language))];
	}));
}

/**
 * Loads the list of available tests that match the given languages
 */
export function loadSomeTests(languages: string | string[], rootDir = LANGUAGES_DIR): Map<string, string[]> {
	return new Map(getSomeDirectories(rootDir, languages).map((language) => {
		return [language, getAllFiles(path.join(rootDir, language))];
	}));
}


/**
 * Returns a list of all (sub)directories (just the directory names, not full paths)
 * in the given src directory
 */
export function getAllDirectories(src: string): string[] {
	return fs.readdirSync(src).filter((file) => {
		return fs.statSync(path.join(src, file)).isDirectory();
	});
}

/**
 * Returns a list of all (sub)directories (just the directory names, not full paths)
 * in the given src directory, matching the given languages
 */
export function getSomeDirectories(src: string, languages: string | string[]): string[] {
	return fs.readdirSync(src).filter((file) => {
		return fs.statSync(path.join(src, file)).isDirectory() && directoryMatches(file, languages);
	});
}

/**
 * Returns whether a directory matches one of the given languages.
 */
export function directoryMatches(directory: string, languages: string | string[]): boolean {
	if (!Array.isArray(languages)) {
		languages = [languages];
	}
	const dirLanguages = directory.split(/!?\+!?/);
	return dirLanguages.some((lang) => languages.includes(lang));
}


/**
 * Returns a list of all full file paths to all files in the given src directory
 */
function getAllFiles(src: string): string[] {
	return fs.readdirSync(src)
		.filter((fileName) => {
			return path.extname(fileName) === '.test'
				&& fs.statSync(path.join(src, fileName)).isFile();
		})
		.map((fileName) => {
			return path.join(src, fileName);
		});
}
