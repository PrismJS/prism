"use strict";

const { src, dest, series, parallel, watch } = require('gulp');

const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const header = require('gulp-header');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const pump = require('pump');
const util = require('util');
const fs = require('fs');

const paths = require('./paths');
const { premerge } = require('./premerge');
const { changes, linkify } = require('./changelog');


const componentsPromise = new Promise((resolve, reject) => {
	fs.readFile(paths.componentsFile, {
		encoding: 'utf-8'
	}, (err, data) => {
		if (!err) {
			resolve(JSON.parse(data));
		} else {
			reject(err);
		}
	});
});

function inlineRegexSource() {
	return replace(
		/\/((?:[^\n\r[\\\/]|\\.|\[(?:[^\n\r\\\]]|\\.)*\])*)\/\.source\b/g,
		(m, source) => {
			// escape backslashes
			source = source.replace(/\\/g, '\\\\');
			// escape single quotes
			source = source.replace(/'/g, "\\'");
			// unescape characters like \\n and \\t to \n and \t
			source = source.replace(/(^|[^\\])\\\\([nrt0])/g, '$1\\$2');
			// wrap source in single quotes
			return "'" + source + "'";
		}
	);
}

function minifyJS() {
	return [
		inlineRegexSource(),
		uglify()
	];
}


function minifyComponents(cb) {
	pump([src(paths.components), ...minifyJS(), rename({ suffix: '.min' }), dest('components')], cb);
}
function minifyPlugins(cb) {
	pump([src(paths.plugins), ...minifyJS(), rename({ suffix: '.min' }), dest('plugins')], cb);
}
function build(cb) {
	pump([src(paths.main), header(`
/* **********************************************
     Begin <%= file.relative %>
********************************************** */

`), concat('prism.js'), dest('./')], cb);
}

async function componentsJsonToJs() {
	const data = await componentsPromise;
	const js = `var components = ${JSON.stringify(data)};
if (typeof module !== 'undefined' && module.exports) { module.exports = components; }`;
	return util.promisify(fs.writeFile)(paths.componentsFileJS, js);
}

function watchComponentsAndPlugins() {
	watch(paths.components, parallel(minifyComponents, build));
	watch(paths.plugins, parallel(minifyPlugins, build));
}

async function languagePlugins() {
	const data = await componentsPromise;
	const languagesMap = {};
	const dependenciesMap = {};
	const aliasMap = {};

	/**
	 * Tries to guess the name of a language given its id.
	 *
	 * From `prism-show-language.js`.
	 *
	 * @param {string} id The language id.
	 * @returns {string}
	 */
	function guessTitle(id) {
		if (!id) {
			return id;
		}
		return (id.substring(0, 1).toUpperCase() + id.substring(1)).replace(/s(?=cript)/, 'S');
	}

	/**
	 * @param {string} key
	 * @param {string} title
	 */
	function addLanguageTitle(key, title) {
		if (!languagesMap[key] && guessTitle(key) !== title) {
			languagesMap[key] = title;
		}
	}

	for (const id in data.languages) {
		if (id !== 'meta') {
			const language = data.languages[id];
			const title = language.displayTitle || language.title;

			addLanguageTitle(id, title);

			for (const name in language.aliasTitles) {
				addLanguageTitle(name, language.aliasTitles[name]);
			}

			if (language.alias) {
				if (typeof language.alias === 'string') {
					aliasMap[language.alias] = id;
					addLanguageTitle(language.alias, title);
				} else {
					language.alias.forEach(function (alias) {
						aliasMap[alias] = id;
						addLanguageTitle(alias, title);
					});
				}
			}

			if (language.require) {
				dependenciesMap[id] = language.require;
			}
		}
	}

	function formattedStringify(json) {
		return JSON.stringify(json, null, '\t').replace(/\n/g, '\n\t');
	}

	const jsonLanguagesMap = formattedStringify(languagesMap);
	const jsonDependenciesMap = formattedStringify(dependenciesMap);
	const jsonAliasMap = formattedStringify(aliasMap);

	const tasks = [
		{
			plugin: paths.showLanguagePlugin,
			maps: { languages: jsonLanguagesMap }
		},
		{
			plugin: paths.autoloaderPlugin,
			maps: { aliases: jsonAliasMap, dependencies: jsonDependenciesMap }
		}
	];

	// TODO: Use `Promise.allSettled` (https://github.com/tc39/proposal-promise-allSettled)
	const taskResults = await Promise.all(tasks.map(async task => {
		try {
			const value = await new Promise((resolve, reject) => {
				const stream = src(task.plugin)
					.pipe(replace(
						/\/\*(\w+)_placeholder\[\*\/[\s\S]*?\/\*\]\*\//g,
						(m, mapName) => `/*${mapName}_placeholder[*/${task.maps[mapName]}/*]*/`
					))
					.pipe(dest(task.plugin.substring(0, task.plugin.lastIndexOf('/'))));

				stream.on('error', reject);
				stream.on('end', resolve);
			});
			return { status: 'fulfilled', value };
		} catch (error) {
			return { status: 'rejected', reason: error };
		}
	}));

	const rejectedTasks = taskResults.filter(/** @return {r is {status: 'rejected', reason: any}} */ r => r.status === 'rejected');
	if (rejectedTasks.length > 0) {
		throw rejectedTasks.map(r => r.reason);
	}
}

const components = minifyComponents;
const plugins = series(languagePlugins, minifyPlugins);


module.exports = {
	watch: watchComponentsAndPlugins,
	default: parallel(components, plugins, componentsJsonToJs, build),
	premerge,
	linkify,
	changes
};
