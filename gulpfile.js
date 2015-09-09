var gulp   = require('gulp'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	header = require('gulp-header'),
	concat = require('gulp-concat'),
	replace = require('gulp-replace'),
	fs = require('fs'),

	paths  = {
		componentsFile: 'components.js',
		components: ['components/**/*.js', '!components/**/*.min.js'],
		main: [
			'components/prism-core.js',
			'components/prism-markup.js',
			'components/prism-css.js',
			'components/prism-clike.js',
			'components/prism-javascript.js',
			'plugins/file-highlight/prism-file-highlight.js'
		],
		plugins: ['plugins/**/*.js', '!plugins/**/*.min.js'],
		showLanguagePlugin: 'plugins/show-language/prism-show-language.js'
	};

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

gulp.task('plugins', ['show-language-plugin'], function() {
	return gulp.src(paths.plugins)
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('plugins'));
});

gulp.task('watch', function() {
	gulp.watch(paths.components, ['components', 'build']);
	gulp.watch(paths.plugins, ['plugins', 'build']);
});

gulp.task('show-language-plugin', function (cb) {
	fs.readFile(paths.componentsFile, {
		encoding: 'utf-8'
	}, function (err, data) {
		if (!err) {
			data = data.replace(/^var\s+components\s*=\s*|;\s*$/g, '');
			try {
				data = JSON.parse(data);

				var languagesMap = {};
				for (var p in data.languages) {
					if (p !== 'meta') {
						var title = data.languages[p].displayTitle || data.languages[p].title;
						var ucfirst = p.substring(0, 1).toUpperCase() + p.substring(1);
						if (title !== ucfirst) {
							languagesMap[p] = title;
						}
					}
				}

				var jsonLanguages = JSON.stringify(languagesMap);
				var stream = gulp.src(paths.showLanguagePlugin)
					.pipe(replace(
						/\/\*languages_placeholder\[\*\/[\s\S]*?\/\*\]\*\//,
						'/*languages_placeholder[*/' + jsonLanguages + '/*]*/'
					))
					.pipe(gulp.dest(paths.showLanguagePlugin.substring(0, paths.showLanguagePlugin.lastIndexOf('/'))));
				stream.on('error', cb);
				stream.on('end', cb);

			} catch (e) {
				cb(e);
			}
		} else {
			cb(err);
		}
	});
});

gulp.task('default', ['components', 'plugins', 'build']);
