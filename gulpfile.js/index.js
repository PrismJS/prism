'use strict';

const { src, dest, series, parallel, watch } = require('gulp');

const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const header = require('gulp-header');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const cleanCSS = require('gulp-clean-css');
const webfont = require('webfont').default;
const pump = require('pump');
const util = require('util');
const fs = require('fs');

const paths = require('./paths');
const { changes, linkify } = require('./changelog');
const { docs } = require('./docs');


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
		/\/((?:[^\n\r[\\\/]|\\.|\[(?:[^\n\r\\\]]|\\.)*\])+)\/\s*\.\s*source\b/g,
		(m, source) => {
			// escape backslashes
			source = source.replace(/\\(.)|\[(?:\\s\\S|\\S\\s)\]/g, function (m, g1) {
				if (g1) {
					// characters like /\n/ can just be kept as "\n" instead of being escaped to "\\n"
					if (/[nrt0/]/.test(g1)) {
						return m;
					}
					if ('\\' == g1) {
						return '\\\\\\\\'; // escape using 4 backslashes
					}
					return '\\\\' + g1;
				} else {
					return '[^]';
				}
			});
			// escape single quotes
			source = source.replace(/'/g, "\\'");
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
function minifyPluginCSS(cb) {
	pump([src(paths.pluginsCSS), cleanCSS(), rename({ suffix: '.min' }), dest('plugins')], cb);
}
function minifyThemes(cb) {
	pump([src(paths.themes), cleanCSS(), rename({ suffix: '.min' }), dest('themes')], cb);
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
	/** @type {Record<string, string | null>} */
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
		if (!(key in languagesMap)) {
			if (guessTitle(key) === title) {
				languagesMap[key] = null;
			} else {
				languagesMap[key] = title;
			}
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

	/** @type {Record<string, string>} */
	const nonNullLanguageMap = {
		'none': 'Plain text',
		'plain': 'Plain text',
		'plaintext': 'Plain text',
		'text': 'Plain text',
		'txt': 'Plain text'
	};
	for (const id in languagesMap) {
		const title = languagesMap[id];
		if (title) {
			nonNullLanguageMap[id] = title;
		}
	}

	const jsonLanguagesMap = formattedStringify(nonNullLanguageMap);
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

	const rejectedTasks = taskResults.filter(/** @returns {r is {status: 'rejected', reason: any}} */ r => r.status === 'rejected');
	if (rejectedTasks.length > 0) {
		throw rejectedTasks.map(r => r.reason);
	}
}

async function treeviewIconFont() {
	// List of all icons
	// Add new icons to the end of the list.
	const iconList = [
		'file', 'folder',
		'image', 'audio', 'video',
		'text', 'code',
		'archive', 'pdf',
		'excel', 'powerpoint', 'word'
	];
	const fontName = 'PrismTreeview';

	// generate the font
	const result = await webfont({
		files: iconList.map(n => `plugins/treeview/icons/${n}.svg`),
		formats: ['woff'],
		fontName,
		sort: false
	});

	/** @type {Buffer} */
	const woff = result.woff;
	/**
	 * @type {{ contents: string; srcPath: string; metadata: Metadata }[]}
	 * @typedef Metadata
	 * @property {string} path
	 * @property {string} name
	 * @property {string[]} unicode
	 * @property {boolean} renamed
	 * @property {number} width
	 * @property {number} height
	 * */
	const glyphsData = result.glyphsData;

	const fontFace = `
/* @GENERATED-FONT */
@font-face {
	font-family: "${fontName}";
	/**
	 * This font is generated from the .svg files in the \`icons\` folder. See the \`treeviewIconFont\` function in
	 * \`gulpfile.js/index.js\` for more information.
	 *
	 * Use the following escape sequences to refer to a specific icon:
	 *
	 * - ${glyphsData.map(({ metadata }) => {
		const codePoint = metadata.unicode[0].codePointAt(0);
		return `\\${codePoint.toString(16)} ${metadata.name}`;
	}).join('\n\t * - ')}
	 */
	src: url("data:application/font-woff;base64,${woff.toString('base64')}")
		format("woff");
}
`.trim();

	const cssPath = 'plugins/treeview/prism-treeview.css';
	const fontFaceRegex = /\/\*\s*@GENERATED-FONT\s*\*\/\s*@font-face\s*\{(?:[^{}/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/)*\}/;

	const css = fs.readFileSync(cssPath, 'utf-8');
	fs.writeFileSync(cssPath, css.replace(fontFaceRegex, fontFace), 'utf-8');
}

const components = minifyComponents;
const plugins = series(languagePlugins, treeviewIconFont, minifyPlugins, minifyPluginCSS);

module.exports = {
	watch: watchComponentsAndPlugins,
	default: series(parallel(components, plugins, minifyThemes, componentsJsonToJs, build), docs),
	linkify,
	changes
};
