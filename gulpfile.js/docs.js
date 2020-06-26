"use strict";

const { src, dest, series } = require('gulp');
const replace = require('gulp-replace');
const jsdoc = require('gulp-jsdoc3');
const pump = require('pump');
const del = require('del');

const paths = require('./paths');


function docsClean() {
	return del([
		// everything in the docs folder
		'docs/**/*',
		// except for our CSS overwrites
		'!docs/styles',
		'!docs/styles/overwrites.css',
	]);
}

function docsCreate(cb) {
	var config = require(paths.jsDoc.config);
	var files = [paths.jsDoc.readme].concat(paths.jsDoc.files);
	src(files, { read: false }).pipe(jsdoc(config, cb));
}

function docsAddCSSOverwrites(cb) {
	return pump([
		src('docs/*.html'),
		replace(
			/\s*<\/head>/,
			'\n    <link type="text/css" rel="stylesheet" href="styles/overwrites.css">$&'
		),
		dest('docs/')
	], cb);
}
function docsRemoveExcessFiles() {
	return del(paths.jsDoc.junk);
}

const docs = series(docsClean, docsCreate, docsRemoveExcessFiles, docsAddCSSOverwrites);

module.exports = {
	docs,
	handlers: {
		jsdocCommentFound(comment) {
			// This is a hack.
			// JSDoc doesn't support TS' type import syntax (e.g. `@type {import("./my-file.js").Type}`) and throws an
			// error if used. So we just replace the "function" with some literal that JSDoc will interpret as a
			// namespace. Not pretty but it works.
			comment.comment = comment.comment
				.replace(/\bimport\s*\(\s*(?:"(?:[^"\r\n\\]|\\.)*"|'(?:[^'\r\n\\]|\\.)*')\s*\)/g, '__dyn_import__')
		}
	}
};
