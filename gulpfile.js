const { src, dest, series, parallel, watch } = require('gulp');

const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const header = require('gulp-header');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const pump = require('pump');
const fs = require('fs');
const simpleGit = require('simple-git');
const shelljs = require('shelljs');

const paths = {
	componentsFile: 'components.json',
	componentsFileJS: 'components.js',
	components: ['components/**/*.js', '!components/index.js', '!components/**/*.min.js'],
	main: [
		'components/prism-core.js',
		'components/prism-markup.js',
		'components/prism-css.js',
		'components/prism-clike.js',
		'components/prism-javascript.js',
		'plugins/file-highlight/prism-file-highlight.js'
	],
	plugins: ['plugins/**/*.js', '!plugins/**/*.min.js'],
	showLanguagePlugin: 'plugins/show-language/prism-show-language.js',
	autoloaderPlugin: 'plugins/autoloader/prism-autoloader.js',
	changelog: 'CHANGELOG.md'
};

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

function componentsJsonToJs(cb) {
	componentsPromise.then(data => {
		const js = `var components = ${JSON.stringify(data)};
if (typeof module !== 'undefined' && module.exports) { module.exports = components; }`;
		fs.writeFile(paths.componentsFileJS, js, cb);
	});
}

function watchComponentsAndPlugins() {
	watch(paths.components, parallel(minifyComponents, build));
	watch(paths.plugins, parallel(minifyPlugins, build));
}

function languagePlugins(cb) {
	componentsPromise.then(data => {
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

		const jsonLanguagesMap = JSON.stringify(languagesMap);
		const jsonDependenciesMap = JSON.stringify(dependenciesMap);
		const jsonAliasMap = JSON.stringify(aliasMap);

		const tasks = [
			{
				plugin: paths.showLanguagePlugin,
				maps: { languages: jsonLanguagesMap}
			},
			{
				plugin: paths.autoloaderPlugin,
				maps: { aliases: jsonAliasMap, dependencies: jsonDependenciesMap }
			}
		];

		let cpt = 0;
		const l = tasks.length;
		const done = () => {
			cpt++;
			if (cpt === l) {
				cb && cb();
			}
		};

		for (const task of tasks) {
			const stream = src(task.plugin)
				.pipe(replace(
					/\/\*(\w+)_placeholder\[\*\/[\s\S]*?\/\*\]\*\//g,
					(m, mapName) => `/*${mapName}_placeholder[*/${task.maps[mapName]}/*]*/`
				))
				.pipe(dest(task.plugin.substring(0, task.plugin.lastIndexOf('/'))));

			stream.on('error', done);
			stream.on('end', done);
		}
	});
}

const ISSUE_RE = /#(\d+)(?![\d\]])/g;
const ISSUE_SUB = '[#$1](https://github.com/PrismJS/prism/issues/$1)';

function linkify(cb) {
	return pump([
		src(paths.changelog),
		replace(ISSUE_RE, ISSUE_SUB),
		replace(
			/\[[\da-f]+(?:, *[\da-f]+)*\]/g,
			m => m.replace(/([\da-f]{7})[\da-f]*/g, '[`$1`](https://github.com/PrismJS/prism/commit/$1)')
		),
		dest('.')
	], cb);
}

const COMMIT_RE = /^([\da-z]{8})\s(.*)/;

function changes(cb) {
	const tag = shelljs.exec('git describe --abbrev=0 --tags', { silent: true }).stdout;
	const commits = shelljs
		.exec(
			`git log ${tag.trim()}..HEAD --oneline`,
			{ silent: true }
		)
		.stdout.split('\n')
		.map(line => line.trim())
		.filter(line => line !== '')
		.map(line => {
			const [,hash, msg] = COMMIT_RE.exec(line);
			return `* ${msg.replace(ISSUE_RE, ISSUE_SUB)} [\`${hash}\`](https://github.com/PrismJS/prism/commit/${hash})`
		})
		.join('\n');

	const changes = `## Unreleased

${commits}

### New components

### Updated components

### Updated plugins

### Updated themes

### Other changes

* __Website__`;

	console.log(changes);
	cb();
}

const components = minifyComponents;
const plugins = series(languagePlugins, minifyPlugins);

function gitChanges(cb) {
	const git = simpleGit(__dirname);

	git.status((err, res) => {
		if (err) {
			cb(new Error(`Something went wrong!\n${err}`));
		} else if (res.files.length > 0) {
			console.log(res);
			cb(new Error('There are changes in the file system. Did you forget to run gulp?'));
		} else {
			cb();
		}
	});
}


exports.watch = watchComponentsAndPlugins;
exports.default = parallel(components, plugins, componentsJsonToJs, build);
exports.premerge = gitChanges;
exports.linkify = linkify;
exports.changes = changes;
