"use strict";

const { src, dest } = require('gulp');

const replace = require('gulp-replace');
const pump = require('pump');
const simpleGit = require('simple-git/promise');

const { changelog } = require('./paths');
const git = require('simple-git/promise')(__dirname);


const ISSUE_RE = /#(\d+)(?![\d\]])/g;
const ISSUE_SUB = '[#$1](https://github.com/PrismJS/prism/issues/$1)';

function linkify(cb) {
	return pump([
		src(changelog),
		replace(ISSUE_RE, ISSUE_SUB),
		replace(
			/\[[\da-f]+(?:, *[\da-f]+)*\]/g,
			m => m.replace(/([\da-f]{7})[\da-f]*/g, '[`$1`](https://github.com/PrismJS/prism/commit/$1)')
		),
		dest('.')
	], cb);
}




function getCommitInfo(line) {
	const [, hash, message] = /^([a-f\d]+)\s+(.*)$/i.exec(line);

	return git.raw(['diff-tree', '--no-commit-id', '--name-status', '-r', hash]).then(res => {
		/* The output looks like this:
		 *
		 * M       components.js
		 * M       components.json
		 *
		 * or nothing for e.g. reverts.
		 */

		const changes = !res ? [] : res.trim().split(/\n/g).map(line => {
			const [, mode, file] = /(\w)\s+(.+)/.exec(line);
			return { mode, file };
		});
		return { hash, message, changes };
	});
}

function getLog(range) {
	return Promise.resolve(range).then(range => {
		return git.raw(['log', range, '--oneline']);
	}).then(res => {
		/* The output looks like this:
		 *
		 * bfbe4464 Invoke `callback` after `after-highlight` hook (#1588)
		 * b41fb8f1 Fixes regex for JS examples (#1591)
		 */
		const commits = !res ? [] : res.trim().split(/\n/g);

		return Promise.all(commits.map(getCommitInfo));
	});
}

const logRanges = {
	nextRelease: git.raw(['describe', '--abbrev=0', '--tags']).then(res => `${res.trim()}..HEAD`),
	v1_15_0__HEAD: 'v1.15.0..HEAD',
	v1_14_0__v1_15_0: 'v1.14.0..v1.15.0',
};

function changes() {

	const { languages, plugins } = require('../components');

	return getLog(logRanges.nextRelease).then(infos => {

		const entries = {
			'TODO:': {},
			'New components': {},
			'Updated components': {},
			'Updated plugins': {},
			'Updated themes': {},
			'Other': {},
		};
		function addEntry(category, info) {
			const path = category.split(/\s*>>\s*/g);
			if (path[path.length - 1] !== '') {
				path.push('');
			}

			let current = entries;
			for (const key of path) {
				if (key) {
					current = current[key] = current[key] || {};
				} else {
					(current[key] = current[key] || []).push(info);
				}
			}
		}


		function outMinJs(change) {
			return !change.file.endsWith('.min.js');
		}
		function outGenerated(change) {
			return ['prism.js', 'components.js'].indexOf(change.file) === -1;
		}
		function outPartlyGenerated(change) {
			return change.file !== 'plugins/autoloader/prism-autoloader.js' &&
				change.file !== 'plugins/show-language/prism-show-language.js';
		}
		function outTests(change) {
			return !/^tests\//.test(change.file);
		}
		function outExamples(change) {
			return !/^examples\//.test(change.file);
		}

		for (const info of infos) {

			// ignore rebuilds were only minified and generated files change
			if (info.changes.length > 0 && info.changes.filter(outMinJs).filter(outGenerated).length === 0) {
				console.log('Rebuild found: ' + info.message);
				continue;
			}

			{ // detect added components
				let relevantChanges = info.changes.filter(outMinJs).filter(outGenerated).filter(outTests).filter(outExamples);

				// `components.json` has to be modified
				if (relevantChanges.some(c => c.file === 'components.json')) {
					relevantChanges = relevantChanges.filter(c => c.file !== 'components.json').filter(outPartlyGenerated);

					// now, only the newly added JS should be left
					if (relevantChanges.length === 1) {
						const change = relevantChanges[0];
						if (change.mode === 'A' && change.file.startsWith('components/prism-')) {
							var lang = change.file.match(/prism-([\w-]+)\.js$/)[1];
							var titles = [languages[lang].title];
							if (languages[lang].aliasTitles) {
								titles.push(...Object.values(languages[lang].aliasTitles));
							}
							addEntry('New components', `__${titles.join('__ & __')}__: ${infoToString(info)}`);
							continue;
						}
					}
				}
			}

			{ // detect changed components & changed Core
				let relevantChanges = info.changes.filter(outMinJs).filter(outGenerated).filter(outTests).filter(outExamples);

				// if `components.json` changed, then autoloader and show-language also change
				if (relevantChanges.some(c => c.file === 'components.json')) {
					relevantChanges = relevantChanges.filter(c => c.file !== 'components.json').filter(outPartlyGenerated);
				}

				if (relevantChanges.length === 1) {
					const change = relevantChanges[0];
					if (change.mode === 'M' && change.file.startsWith('components/prism-')) {
						var lang = change.file.match(/prism-([\w-]+)\.js$/)[1];
						if (lang === 'core') {
							addEntry('Other >> Core', info);
							continue;
						} else {
							addEntry('Updated components >> ' + languages[lang].title, info);
							continue;
						}
					}
				}
			}

			{ // detect changed plugins
				let relevantChanges = info.changes.filter(outMinJs).filter(outGenerated).filter(outTests).filter(outExamples)
					.filter(c => !/\.(?:html|css)$/.test(c.file));

				if (relevantChanges.length > 0 &&
					relevantChanges.every(c => c.mode === 'M' && /^plugins\/.*\.js$/.test(c.file))) {

					if (relevantChanges.length === 1) {
						const change = relevantChanges[0];
						const id = change.file.match(/\/prism-([\w-]+)\.js/)[1];
						const title = plugins[id].title || plugins[id];
						addEntry('Updated plugins >> ' + title, info);
						continue;
					} else {
						addEntry('Updated plugins', info);
						continue;
					}
				}
			}

			// detect changed themes
			if (info.changes.length > 0 && info.changes.every(c => {
				return /themes\/.*\.css/.test(c.file) && c.mode === 'M';
			})) {
				if (info.changes.length === 1) {
					const change = info.changes[0];
					let name = (change.file.match(/prism-(\w+)\.css$/) || [, 'Default'])[1];
					name = name[0].toUpperCase() + name.substr(1);
					addEntry('Updated themes >> ' + name, info);
					continue;
				} else {
					addEntry('Updated themes', info);
					continue;
				}
			}

			// detect infrastructure changes
			if (info.changes.length > 0 && info.changes.every(c => {
				if (c.file.startsWith('gulpfile.js')) {
					return true;
				}
				if (/^\.[\w.]+$/.test(c.file)) {
					return true;
				}
				return ['CNAME', 'composer.json', 'package.json', 'package-lock.json'].indexOf(c.file) >= 0;
			})) {
				addEntry('Other >> Infrastructure', info);
				continue;
			}

			// detect website changes
			if (info.changes.length > 0 && info.changes.every(c => {
				if (/[\w-]+\.(?:html|svg)$/.test(c.file)) {
					return true;
				}
				if (/^scripts(?:\/[\w-]+)*\/[\w-]+\.js$/.test(c.file)) {
					return true;
				}
				return ['style.css'].indexOf(c.file) >= 0;
			})) {
				addEntry('Other >> Website', info);
				continue;
			}

			// detect changes of the Github setup
			// This assumes that .md files are related to GitHub
			if (info.changes.length > 0 && info.changes.every(c => /\.md$/i.test(c.file))) {
				addEntry('Other', info);
				continue;
			}

			addEntry('TODO:', info);
		}


		function infoToString(info) {
			if (typeof info === 'string') {
				return info;
			}
			return `${info.message} [\`${info.hash}\`](https://github.com/PrismJS/prism/commit/${info.hash})`;
		}
		function printCategory(category, indentation = '') {
			for (const subCategory of Object.keys(category).sort((a, b) => a.localeCompare(b, 'en'))) {
				if (subCategory) {
					md += `${indentation}* __${subCategory}__\n`;
					printCategory(category[subCategory], indentation + '    ')
				} else {
					for (const info of category['']) {
						md += `${indentation}* ${infoToString(info)}\n`;
					}
				}
			}
		}

		let md = '';
		for (const category of Object.keys(entries)) {
			md += `\n### ${category}\n\n`;
			printCategory(entries[category]);
		}
		console.log(md);
	});
}


module.exports = { linkify, changes };
