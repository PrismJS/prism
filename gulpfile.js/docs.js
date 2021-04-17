'use strict';

const { src, dest, series } = require('gulp');
const replace = require('gulp-replace');
const jsdoc = require('gulp-jsdoc3');
const pump = require('pump');
const del = require('del');

const jsDoc = {
	config: '../.jsdoc.json',
	readme: 'README.md',
	files: ['components/prism-core.js'],
	junk: ['docs/fonts/Source-Sans-Pro', 'docs/**/Apache-License-2.0.txt']
};


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
	let config = require(jsDoc.config);
	let files = [jsDoc.readme].concat(jsDoc.files);
	src(files, { read: false }).pipe(jsdoc(config, cb));
}

function docsAddFavicon(cb) {
	return pump([
		src('docs/*.html'),
		replace(
			/\s*<\/head>/,
			'\n    <link rel="icon" type="image/png" href="/favicon.png"/>$&'
		),
		dest('docs/')
	], cb);
}

function docsRemoveExcessFiles() {
	return del(jsDoc.junk);
}

function docsFixLineEnds(cb) {
	// https://github.com/jsdoc/jsdoc/issues/1837
	return pump([
		src('docs/*.html'),
		replace(/\r\n?|\n/g, '\n'),
		dest('docs/')
	], cb);
}

const docs = series(docsClean, docsCreate, docsRemoveExcessFiles, docsAddFavicon, docsFixLineEnds);

module.exports = {
	docs,
	handlers: {
		jsdocCommentFound(comment) {
			// This is a hack.
			// JSDoc doesn't support TS' type import syntax (e.g. `@type {import("./my-file.js").Type}`) and throws an
			// error if used. So we just replace the "function" with some literal that JSDoc will interpret as a
			// namespace. Not pretty but it works.
			comment.comment = comment.comment
				.replace(/\bimport\s*\(\s*(?:"(?:[^"\r\n\\]|\\.)*"|'(?:[^'\r\n\\]|\\.)*')\s*\)/g, '__dyn_import__');
		}
	}
};
