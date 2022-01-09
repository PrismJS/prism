'use strict';

const { src, dest } = require('gulp');

const replace = require('gulp-replace');
const pump = require('pump');
const git = require('simple-git/promise')(__dirname);

const { changelog } = require('./paths');


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

/**
 * Creates an array which iterates its items in the order given by `compareFn`.
 *
 * The array may not be sorted at all times.
 *
 * @param {(a: T, b: T) => number} compareFn
 * @returns {T[]}
 * @template T
 */
function createSortedArray(compareFn) {
	/** @type {T[]} */
	const a = [];

	a['sort'] = function () {
		return Array.prototype.sort.call(this, compareFn);
	};
	a[Symbol.iterator] = function () {
		return this.slice().sort(compareFn)[Symbol.iterator]();
	};

	return a;
}

/**
 * Parses the given log line and adds the list of the changed files to the output.
 *
 * @param {string} line A one-liner log line consisting of the commit hash and the commit message.
 * @returns {Promise<CommitInfo>}
 *
 * @typedef {{ message: string, hash: string, changes: CommitChange[] }} CommitInfo
 * @typedef {{ file: string, mode: ChangeMode }} CommitChange
 * @typedef {"A" | "C" | "D" | "M" | "R" | "T" | "U" | "X" | "B"} ChangeMode
 */
async function getCommitInfo(line) {
	// eslint-disable-next-line regexp/no-super-linear-backtracking
	const [, hash, message] = /^([a-f\d]+)\s+(.*)$/i.exec(line);

	/* The output looks like this:
	 *
	 * M       components.js
	 * M       components.json
	 *
	 * or nothing for e.g. reverts.
	 */
	const output = await git.raw(['diff-tree', '--no-commit-id', '--name-status', '-r', hash]);

	const changes = !output ? [] : output.trim().split(/\n/g).map(line => {
		const [, mode, file] = /(\w)\s+(.+)/.exec(line);
		return { mode: /** @type {ChangeMode} */ (mode), file };
	});

	return { hash, message, changes };
}

/**
 * Parses the output of `git log` with the given revision range.
 *
 * @param {string | Promise<string>} range The revision range in which the log will be parsed.
 * @returns {Promise<CommitInfo[]>}
 */
async function getLog(range) {
	/* The output looks like this:
	*
	* bfbe4464 Invoke `callback` after `after-highlight` hook (#1588)
	* b41fb8f1 Fixes regex for JS examples (#1591)
	*/
	const output = await git.raw(['log', await Promise.resolve(range), '--oneline']);

	if (output) {
		const commits = output.trim().split(/\n/g);
		return Promise.all(commits.map(getCommitInfo));
	} else {
		return [];
	}
}

const revisionRanges = {
	nextRelease() {
		return git.raw(['describe', '--abbrev=0', '--tags']).then(res => `${res.trim()}..HEAD`);
	}
};
const strCompare = (a, b) => a.localeCompare(b, 'en');

async function changes() {
	const { languages, plugins } = require('../components.js');

	const infos = await getLog(revisionRanges.nextRelease());

	const entries = {
		'TODO:': {},
		'New components': {
			['']: createSortedArray(strCompare)
		},
		'Updated components': {},
		'Updated plugins': {},
		'Updated themes': {},
		'Other': {},
	};
	/**
	 *
	 * @param {string} category
	 * @param {string | { message: string, hash: string }} info
	 */
	function addEntry(category, info) {
		const path = category.split(/\s*>>\s*/);
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


	/** @param {CommitChange} change */
	function notGenerated(change) {
		return !change.file.endsWith('.min.js')
			&& !change.file.startsWith('docs/')
			&& ['prism.js', 'components.js', 'package-lock.json'].indexOf(change.file) === -1;
	}
	/** @param {CommitChange} change */
	function notPartlyGenerated(change) {
		return change.file !== 'plugins/autoloader/prism-autoloader.js' &&
			change.file !== 'plugins/show-language/prism-show-language.js';
	}
	/** @param {CommitChange} change */
	function notTests(change) {
		return !/^tests\//.test(change.file);
	}
	/** @param {CommitChange} change */
	function notExamples(change) {
		return !/^examples\//.test(change.file);
	}
	/** @param {CommitChange} change */
	function notFailures(change) {
		return !/^known-failures.html$/.test(change.file);
	}
	/** @param {CommitChange} change */
	function notComponentsJSON(change) {
		return change.file !== 'components.json';
	}

	/**
	 * @param {((e: T, index: number) => boolean)[]} filters
	 * @returns {(e: T, index: number) => boolean}
	 * @template T
	 */
	function and(...filters) {
		return (e, index) => {
			for (let i = 0, l = filters.length; i < l; i++) {
				if (!filters[i](e, index)) {
					return false;
				}
			}
			return true;
		};
	}

	/**
	 * Some commit message have the format `component changed: actual message`.
	 * This function can be used to remove this prefix.
	 *
	 * @param {string} prefix
	 * @param {CommitInfo} info
	 * @returns {{ message: string, hash: string }}
	 */
	function removeMessagePrefix(prefix, info) {
		const source = String.raw`^${prefix.replace(/([^-\w\s])/g, '\\$1').replace(/[-\s]/g, '[-\\s]')}:\s*`;
		const patter = RegExp(source, 'i');
		return {
			message: info.message.replace(patter, ''),
			hash: info.hash
		};
	}


	/**
	 * @type {((info: CommitInfo) => boolean)[]}
	 */
	const commitSorters = [

		function rebuild(info) {
			if (info.changes.length > 0 && info.changes.filter(notGenerated).length === 0) {
				console.log('Rebuild found: ' + info.message);
				return true;
			}
		},

		function addedComponent(info) {
			let relevantChanges = info.changes.filter(and(notGenerated, notTests, notExamples, notFailures));

			// `components.json` has to be modified
			if (relevantChanges.some(c => c.file === 'components.json')) {
				relevantChanges = relevantChanges.filter(and(notComponentsJSON, notPartlyGenerated));

				// now, only the newly added JS should be left
				if (relevantChanges.length === 1) {
					const change = relevantChanges[0];
					if (change.mode === 'A' && change.file.startsWith('components/prism-')) {
						const lang = change.file.match(/prism-([\w-]+)\.js$/)[1];
						const entry = languages[lang] || {
							title: 'REMOVED LANGUAGE ' + lang,
						};
						const titles = [entry.title];
						if (entry.aliasTitles) {
							titles.push(...Object.values(entry.aliasTitles));
						}
						addEntry('New components', `__${titles.join('__ & __')}__: ${infoToString(info)}`);
						return true;
					}
				}
			}
		},

		function changedComponentOrCore(info) {
			let relevantChanges = info.changes.filter(and(notGenerated, notTests, notExamples, notFailures));

			// if `components.json` changed, then autoloader and show-language also change
			if (relevantChanges.some(c => c.file === 'components.json')) {
				relevantChanges = relevantChanges.filter(and(notComponentsJSON, notPartlyGenerated));
			}

			if (relevantChanges.length === 1) {
				const change = relevantChanges[0];
				if (change.mode === 'M' && change.file.startsWith('components/prism-')) {
					const lang = change.file.match(/prism-([\w-]+)\.js$/)[1];
					if (lang === 'core') {
						addEntry('Other >> Core', removeMessagePrefix('Core', info));
					} else {
						const title = languages[lang].title;
						addEntry('Updated components >> ' + title, removeMessagePrefix(title, info));
					}
					return true;
				}
			}
		},

		function changedPlugin(info) {
			let relevantChanges = info.changes.filter(and(notGenerated, notTests, notExamples, c => !/\.(?:css|html)$/.test(c.file)));

			if (relevantChanges.length > 0 &&
				relevantChanges.every(c => c.mode === 'M' && /^plugins\/.*\.js$/.test(c.file))) {

				if (relevantChanges.length === 1) {
					const change = relevantChanges[0];
					const id = change.file.match(/\/prism-([\w-]+)\.js/)[1];
					const title = plugins[id].title || plugins[id];
					addEntry('Updated plugins >> ' + title, removeMessagePrefix(title, info));
				} else {
					addEntry('Updated plugins', info);
				}
				return true;
			}
		},

		function changedTheme(info) {
			if (info.changes.length > 0 && info.changes.every(c => {
				return /themes\/.*\.css/.test(c.file) && c.mode === 'M';
			})) {
				if (info.changes.length === 1) {
					const change = info.changes[0];
					let name = (change.file.match(/prism-(\w+)\.css$/) || [, 'Default'])[1];
					name = name[0].toUpperCase() + name.substr(1);
					addEntry('Updated themes >> ' + name, removeMessagePrefix(name, info));
				} else {
					addEntry('Updated themes', info);
				}
				return true;
			}
		},

		function changedInfrastructure(info) {
			let relevantChanges = info.changes.filter(notGenerated);

			if (relevantChanges.length > 0 && relevantChanges.every(c => {
				if (/^(?:gulpfile.js|tests)\//.test(c.file)) {
					// gulp tasks or tests
					return true;
				}
				if (/^\.[\w.]+$/.test(c.file)) {
					// a .something file
					return true;
				}
				return ['bower.json', 'CNAME', 'composer.json', 'package.json', 'package-lock.json'].indexOf(c.file) >= 0;
			})) {
				addEntry('Other >> Infrastructure', info);
				return true;
			}

			// or dependencies.js
			const excludeTests = info.changes.filter(notTests);
			if (excludeTests.length === 1 && excludeTests[0].file === 'dependencies.js') {
				addEntry('Other >> Infrastructure', info);
				return true;
			}
		},

		function changedWebsite(info) {
			if (info.changes.length > 0 && info.changes.every(c => {
				return /[\w-]+\.html$/.test(c.file) || /^(?:assets|docs)\//.test(c.file);
			})) {
				addEntry('Other >> Website', info);
				return true;
			}
		},

		function otherChanges(info) {
			// detect changes of the Github setup
			// This assumes that .md files are related to GitHub
			if (info.changes.length > 0 && info.changes.every(c => /\.md$/i.test(c.file))) {
				addEntry('Other', info);
				return true;
			}
		},

	];

	for (const info of infos) {
		if (!commitSorters.some(sorter => sorter(info))) {
			addEntry('TODO:', info);
		}
	}


	let md = '';

	/**
	 * Stringifies the given commit info.
	 *
	 * @param {string | CommitInfo} info
	 * @returns {string}
	 */
	function infoToString(info) {
		if (typeof info === 'string') {
			return info;
		}
		return `${info.message} [\`${info.hash}\`](https://github.com/PrismJS/prism/commit/${info.hash})`;
	}
	function printCategory(category, indentation = '') {
		for (const subCategory of Object.keys(category).sort(strCompare)) {
			if (subCategory) {
				md += `${indentation}* __${subCategory}__\n`;
				printCategory(category[subCategory], indentation + '    ');
			} else {
				for (const info of category['']) {
					md += `${indentation}* ${infoToString(info)}\n`;
				}
			}
		}
	}

	for (const category of Object.keys(entries)) {
		md += `\n### ${category}\n\n`;
		printCategory(entries[category]);
	}
	console.log(md);
}


module.exports = {
	linkify,
	changes
};
