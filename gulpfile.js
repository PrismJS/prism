const { src, dest, series, parallel, watch } = require('gulp');

const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const header = require('gulp-header');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const pump = require('pump');
const fs = require('fs');

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

		for (const p in data.languages) {
			if (p !== 'meta') {
				const title = data.languages[p].displayTitle || data.languages[p].title;

				addLanguageTitle(p, title);

				for (const name in data.languages[p].aliasTitles) {
					addLanguageTitle(name, data.languages[p].aliasTitles[name]);
				}

				if (data.languages[p].alias) {
					if (typeof data.languages[p].alias === 'string') {
						addLanguageTitle(data.languages[p].alias, title);
					} else {
						data.languages[p].alias.forEach(function (alias) {
							addLanguageTitle(alias, title);
						});
					}
				}

				if (data.languages[p].require) {
					dependenciesMap[p] = data.languages[p].require;
				}
			}
		}

		const jsonLanguagesMap = JSON.stringify(languagesMap);
		const jsonDependenciesMap = JSON.stringify(dependenciesMap);

		const tasks = [
			{ plugin: paths.showLanguagePlugin, map: jsonLanguagesMap },
			{ plugin: paths.autoloaderPlugin, map: jsonDependenciesMap }
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
					/\/\*languages_placeholder\[\*\/[\s\S]*?\/\*\]\*\//,
					'/*languages_placeholder[*/' + task.map + '/*]*/'
				))
				.pipe(dest(task.plugin.substring(0, task.plugin.lastIndexOf('/'))));

			stream.on('error', done);
			stream.on('end', done);
		}
	});
}

function changelog(cb) {
	return pump([
		src(paths.changelog),
		replace(
			/#(\d+)(?![\d\]])/g,
			'[#$1](https://github.com/PrismJS/prism/issues/$1)'
		),
		replace(
			/\[[\da-f]+(?:, *[\da-f]+)*\]/g,
			m => m.replace(/([\da-f]{7})[\da-f]*/g, '[`$1`](https://github.com/PrismJS/prism/commit/$1)')
		),
		dest('.')
	], cb);
}

const components = minifyComponents;
const plugins = series(languagePlugins, minifyPlugins);


exports.watch = watchComponentsAndPlugins;
exports.default = parallel(components, plugins, componentsJsonToJs, build);
exports.changelog = changelog;
