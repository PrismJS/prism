var gulp   = require('gulp'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	header = require('gulp-header'),
	concat = require('gulp-concat'),
	replace = require('gulp-replace'),
	pump = require('pump'),
	fs = require('fs'),

	paths  = {
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
	},

	componentsPromise = new Promise(function (resolve, reject) {
		fs.readFile(paths.componentsFile, {
			encoding: 'utf-8'
		}, function (err, data) {
			if (!err) {
				resolve(JSON.parse(data));
			} else {
				reject(err);
			}
		});
	}),

	inlineRegexSource = function () {
		return replace(
			/\/((?:[^\n\r[\\\/]|\\.|\[(?:[^\n\r\\\]]|\\.)*\])*)\/\.source\b/g,
			function (m, source) {
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
	};

gulp.task('components', function(cb) {
	pump(
		[
			gulp.src(paths.components),
			inlineRegexSource(),
			uglify(),
			rename({ suffix: '.min' }),
			gulp.dest('components')
		],
		cb
	);
});

gulp.task('build', function() {
	return gulp.src(paths.main)
		.pipe(header('\n/* **********************************************\n' +
			'     Begin <%= file.relative %>\n' +
			'********************************************** */\n\n'))
		.pipe(concat('prism.js'))
		.pipe(gulp.dest('./'));
});

gulp.task('plugins', ['languages-plugins'], function(cb) {
	pump(
		[
			gulp.src(paths.plugins),
			inlineRegexSource(),
			uglify(),
			rename({ suffix: '.min' }),
			gulp.dest('plugins')
		],
		cb
	);
});

gulp.task('components-json', function (cb) {
	componentsPromise.then(function (data) {
		data = 'var components = ' + JSON.stringify(data) + ';\n' +
			'if (typeof module !== \'undefined\' && module.exports) { module.exports = components; }';
		fs.writeFile(paths.componentsFileJS, data, cb);
	});
});

gulp.task('watch', function() {
	gulp.watch(paths.components, ['components', 'build']);
	gulp.watch(paths.plugins, ['plugins', 'build']);
});

gulp.task('languages-plugins', function (cb) {
	componentsPromise.then(function (data) {
		var languagesMap = {};
		var dependenciesMap = {};

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

		for (var p in data.languages) {
			if (p !== 'meta') {
				var title = data.languages[p].displayTitle || data.languages[p].title;

				addLanguageTitle(p, title);

				for (var name in data.languages[p].aliasTitles) {
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

		var jsonLanguagesMap = JSON.stringify(languagesMap);
		var jsonDependenciesMap = JSON.stringify(dependenciesMap);

		var tasks = [
			{plugin: paths.showLanguagePlugin, map: jsonLanguagesMap},
			{plugin: paths.autoloaderPlugin, map: jsonDependenciesMap}
		];

		var cpt = 0;
		var l = tasks.length;
		var done = function() {
			cpt++;
			if(cpt === l) {
				cb && cb();
			}
		};

		tasks.forEach(function(task) {
			var stream = gulp.src(task.plugin)
				.pipe(replace(
					/\/\*languages_placeholder\[\*\/[\s\S]*?\/\*\]\*\//,
					'/*languages_placeholder[*/' + task.map + '/*]*/'
				))
				.pipe(gulp.dest(task.plugin.substring(0, task.plugin.lastIndexOf('/'))));

			stream.on('error', done);
			stream.on('end', done);
		});
	});
});

gulp.task('changelog', function (cb) {
	return gulp.src(paths.changelog)
		.pipe(replace(
			/#(\d+)(?![\d\]])/g,
			'[#$1](https://github.com/PrismJS/prism/issues/$1)'
		))
		.pipe(replace(
			/\[[\da-f]+(?:, *[\da-f]+)*\]/g,
			function (match) {
				return match.replace(/([\da-f]{7})[\da-f]*/g, '[`$1`](https://github.com/PrismJS/prism/commit/$1)');
			}
		))
		.pipe(gulp.dest('.'));
});

gulp.task('default', ['components', 'components-json', 'plugins', 'build']);
