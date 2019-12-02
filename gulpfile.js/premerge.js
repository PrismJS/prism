"use strict";

const { parallel } = require('gulp');
const fs = require('fs');
const git = require('simple-git/promise')(__dirname);
// use the JSON file because this file is less susceptible to merge conflicts
const { languages } = require('../components.json');


/**
 * Checks that no files have been modified by the build process.
 */
function gitChanges() {
	return git.status().then(res => {
		if (res.files.length > 0) {
			console.log(res);
			throw new Error('There are changes in the file system. Did you forget to run gulp?');
		}
	});
}

/**
 * Checks that all languages have and example.
 */
async function hasExample() {
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

	/** @type {string[]} */
	const missing = [];
	for (const lang in languages) {
		if (lang === 'meta') {
			continue;
		}

		if (!exampleFiles.delete(`prism-${lang}.html`)) {
			if (!ignore.has(lang)) {
				missing.push(lang);
			}
		}
	}

	const errors = missing.map(id => `Missing example for ${id}.`);
	for (const file of exampleFiles) {
		errors.push(`The examples file "${file}" has no language associated with it.`);
	}

	if (errors.length) {
		throw new Error(errors.join('\n'));
	}
}


module.exports = {
	premerge: parallel(gitChanges, hasExample)
};
