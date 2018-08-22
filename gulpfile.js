var gulp   = require('gulp'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	header = require('gulp-header'),
	concat = require('gulp-concat'),
	replace = require('gulp-replace'),
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
	};


/**
 * Converts the given stream into a `Promise`.
 * @param {NodeJS.ReadableStream & NodeJS.EventEmitter} stream
 * @returns {Promise}
 */
function promiseStream(stream) {
	return new Promise(function (resolve, reject) {
		stream.on('end', function (err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

/**
 * Reads the given file and returns a `Promise` with the read string.
 * @param {string} path the path of the file.
 * @returns {Promise.<string>}
 */
function readString(path) {
	var cache = readString._cache || {};
	readString._cache = cache;

	return cache[path] = cache[path] || new Promise(function (resolve, reject) {
		fs.readFile(path, {
			encoding: 'utf-8'
		}, function (err, data) {
			if (!err) {
				resolve(data);
			} else {
				reject(err);
			}
		});
	});
}

/**
 * Reads the given file and returns a `Promise` with the parsed JSON data.
 * @param {string} path the path of the file.
 * @returns {Promise.<Object.<string, any>>}
 */
function readJson(path) {
	return readString(path).then(JSON.parse);
}

/**
 * Replaces all annotation values with the value returned by `replacer`.
 *
 * An annotation is a single line JS comment followed by a variable declaration. E.g.:
 *
 * ```
// @annotation
var variable = $value$;
// @annotation.name(options)
'objectKey': $value$,
```
 *
 * The `replacer` will be given the name of the annotation, the specified options (optional), and `$value$`.
 * The returned string will replace `$value$`.
 * @param {(annotation: string, options: string) => string} replacer
 * @returns {NodeJS.ReadWriteStream}
 */
function replaceAnnotations(replacer) {
	if (!replaceAnnotations.pattern) {
		var annotation = /@([\w.]+)/.source; // capturing group
		var annotationOptions = /(?:\(((?:[^"()]|"(?:[^\\"]|\\.)*")*)\))?/.source; // capturing group

		var comment = /^[ \t]*\/\/[ \t]*/.source + annotation + annotationOptions + /[ \t]*/.source;

		var variableDeclaration = /(?:var|let|const)\s+\w+\s*=\s*/.source;
		var objectKey = /(?:'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|\w+)\s*:\s*/.source;

		var beforeValue = '^(' + comment + /[\n\r]+^[ \t]*/.source + '(?:' + variableDeclaration + '|' + objectKey + ')' + ')'; // capturing group
		var afterValue = /(?=[;,][ \t]*$|[ \t]*$\s*\})/.source;

		replaceAnnotations.pattern = RegExp(beforeValue + '(.*[^;,\s])' + afterValue, 'gm');
	}

	return replace(
		replaceAnnotations.pattern,
		function (m, commentPlusVar, annotationName, annotationOptions, value) {
			try {
				return commentPlusVar + replacer(annotationName, annotationOptions, value);
			} catch (e) {
				throw new Error(e.message + '\nAt:\n' + commentPlusVar);
			}
		}
	);
}


gulp.task('components', function() {
	return gulp.src(paths.components)
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('components'));
});

gulp.task('build', function() {
	return gulp.src(paths.main)
		.pipe(header('\n/* **********************************************\n' +
			'     Begin <%= file.relative %>\n' +
			'********************************************** */\n\n'))
		.pipe(concat('prism.js'))
		.pipe(gulp.dest('./'));
});

gulp.task('plugins', ['languages-plugins'], function() {
	return gulp.src(paths.plugins)
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('plugins'));
});

gulp.task('components-json', function () {
	return readJson(paths.componentsFile).then(function (json) {

		var stream = gulp.src(paths.componentsFileJS, { base: './' })
			.pipe(replaceAnnotations(function (anno) {
				switch (anno) {
					case 'components':
						return JSON.stringify(json);
					default:
						throw new Error('Unknown annotation: ' + anno);
				}
			}))
			.pipe(gulp.dest('./'));

		return promiseStream(stream);
	});
});

gulp.task('watch', function() {
	gulp.watch(paths.components, ['components', 'build']);
	gulp.watch(paths.plugins, ['plugins', 'build']);
});

gulp.task('languages-plugins', function () {
	return readJson(paths.componentsFile).then(function (data) {
		var languagesMap = {};
		var dependenciesMap = {};
		for (var p in data.languages) {
			if (p !== 'meta') {
				var title = data.languages[p].displayTitle || data.languages[p].title;
				var ucfirst = p.substring(0, 1).toUpperCase() + p.substring(1);
				if (title !== ucfirst) {
					languagesMap[p] = title;
				}

				for (var name in data.languages[p].aliasTitles) {
					languagesMap[name] = data.languages[p].aliasTitles[name];
				}

				if (data.languages[p].require) {
					dependenciesMap[p] = data.languages[p].require;
				}
			}
		}

		var jsonLanguagesMap = JSON.stringify(languagesMap);
		var jsonDependenciesMap = JSON.stringify(dependenciesMap);

		var stream = gulp.src(paths.plugins, { base: './' })
			.pipe(replaceAnnotations(function (anno, options) {
				switch (anno) {
					case 'languages.dependencies':
						return jsonDependenciesMap;
					case 'languages.titles':
						return jsonLanguagesMap;
					default:
						throw new Error('Unknown annotation: ' + anno);
				}
			}))
			.pipe(gulp.dest('./'));

		return promiseStream(stream);
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
