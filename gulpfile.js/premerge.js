"use strict";

const simpleGit = require('simple-git/promise');


function gitChanges() {
	const git = simpleGit(__dirname);

	console.log(__dirname);

	return git.status().then(res => {
		if (res.files.length > 0) {
			console.log(res);
			throw new Error('There are changes in the file system. Did you forget to run gulp?');
		}
	});
}

exports.premerge = gitChanges;
