const { danger, markdown } = require('danger');
const fs = require('fs').promises;
const gzipSize = require('gzip-size');
const git = require('simple-git/promise')(__dirname);

// https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
const formatBytes = (bytes, decimals = 2) => {
	if (bytes === 0) return '0 Bytes';

	const k = 1000;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const maybePlus = (from, to) => from < to ? "+" : "";

const absDiff = (from, to) => {
	if (from === to) {
		return formatBytes(0);
	}

	return `${maybePlus(from, to)}${formatBytes(to - from)}`;
}

const percDiff = (from, to) => {
	if (from === to) {
		return '0%';
	}

	const percentage = 100 * (to - from) / ((from + to) / 2);
	return `${maybePlus(from, to)}${percentage.toFixed(1)}%`;
}

const run = async () => {
	const minified = danger.git.modified_files.filter(file => file.endsWith('.min.js'));

	if (minified.length === 0) {
		markdown(`## No JS Changes`);
		return;
	}

	// Check if master exists & check it out if not.
	const result = await git.branch(['--list', 'master']);
	if (result.all.length === 0) {
		await git.branch(['master', 'origin/master']);
	}

	/** @type {[string, string, string, string, string][]} */
	const rows = [];

	for (const file of minified) {
		const [fileContents, fileMasterContents] = await Promise.all([
			fs.readFile(file, 'utf-8').catch(() => null),
			git.show([`master:${file}`]).catch(() => null),
		]);

		const [fileSize, fileMasterSize] = await Promise.all([
			fileContents ? gzipSize(fileContents) : 0,
			fileMasterContents ? gzipSize(fileMasterContents) : 0,
		]);

		rows.push([
			file,
			formatBytes(fileSize),
			formatBytes(fileMasterSize),
			absDiff(fileMasterSize, fileSize),
			percDiff(fileMasterSize, fileSize),
		]);
	}

	markdown(`
## JS File Size Changes (gzipped)

| file | master | pull | size diff | % diff |
| --- | --- | --- | --- | --- |
${rows.map(row => `| ${row.join(' | ')} |`).join('\n')}
`);
}

run().catch(err => {
	console.error(err);
	process.exit(1);
});
