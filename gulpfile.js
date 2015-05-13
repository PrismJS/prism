var gulp   = require('gulp'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	header = require('gulp-header'),
	concat = require('gulp-concat'),
	highland = require('highland'),
	fs = require('fs'),
	path = require('path'),
	File = require('vinyl'),
	del = require('del'),
	yargs = require('yargs'),
	npm = require('npm'),

  runningPackagingTask = yargs.argv._.indexOf('createPackages') > -1,
  version = yargs.argv.version,

	paths  = {
		components: ['components/**/*.js', '!components/**/*.min.js'],
		main: [
			'components/prism-core.js',
			'components/prism-markup.js',
			'components/prism-css.js',
			'components/prism-clike.js',
			'components/prism-javascript.js',
			'plugins/file-highlight/prism-file-highlight.js'
		],
		plugins: ['plugins/**/*.js', '!plugins/**/*.min.js']
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

gulp.task('plugins', function() {
	return gulp.src(paths.plugins)
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('plugins'));
});

gulp.task('watch', function() {
	gulp.watch(paths.components, ['components', 'build']);
	gulp.watch(paths.plugins, ['plugins', 'build']);
});

gulp.task('default', ['components', 'plugins', 'build']);



/* tasks for creating and publishing npm packages */

function readme(themeName) {
	return [
		'# Prism ' + themeName.charAt(0).toUpperCase() + themeName.substring(1) + ' Theme',
		'Prism is a lightweight, robust, elegant syntax highlighting library.',
		'Learn more at [http://prismjs.com/](http://prismjs.com/).'
	].join('\n\n');
}

function packagejson(themeName) {
	return JSON.stringify({
		name: 'prism-' + themeName + '-theme',
		version: version,
	  description: 'A CSS theme for PrismJS',
		repository: {
			type: 'git',
			url: 'https://github.com/PrismJS/prism.git'
		},
		keywords: [
			'prism',
			'highlight',
			'theme'
		],
		author: 'Lea Verou',
		license: 'MIT',
		style: 'prism-' + themeName + '.css'
	}, null, 2);
}

function license(themeName) {
	return fs.readFileSync('LICENSE');
}

var contentStrategy = {
	'package.json': packagejson,
	'README.md': readme,
	'LICENSE': license
};

gulp.task('clean-dist', function(done) {
	del('dist', done);
});

gulp.task('copy-css', ['build', 'clean-dist'], function() {
	return highland(gulp.src('themes/*.css'))
		.map(function(file) {
			var name = path.basename(file.path) === 'prism.css' ? 'prism-default' : path.basename(file.path, '.css');
			file.path = path.join(path.dirname(file.path), name, name + '.css');
			return file;
		})
		.pipe(gulp.dest('dist'));
});

gulp.task('copy-files', ['copy-css'], function() {
	return highland(gulp.src('dist/*'))
		.flatMap(function(dir) {
			var themeName = /prism-(\w+)/.exec(path.basename(dir.path))[1];
			return ['package.json', 'README.md', 'LICENSE']
				.map(function(fileName) {
					return new File({
						base: path.dirname(dir.path),
						path: path.join(dir.path, fileName),
						contents: new Buffer(contentStrategy[fileName](themeName))
					});
				});
		})
		.pipe(gulp.dest('dist'));
});

gulp.task('update-version', function() {
	return highland(gulp.src('package.json'))
		.map(function(file) {
			var packageInfo = JSON.parse(file.contents);
			packageInfo.version = version;
			file.contents = new Buffer(JSON.stringify(packageInfo, null, 2));
			return file;
		})
		.pipe(gulp.dest('.'));
});

if (runningPackagingTask && !version) {
	console.error('Please specify a version number for the release, for example: gulp createPackages --version 1.0.42');
	process.exit(1);
}

gulp.task('createPackages', ['copy-css', 'copy-files', 'update-version']);

gulp.task('publishPackages', function(done) {
	var packages = fs.readdirSync('dist')
		.map(function(packageName) {
			return path.join('dist', packageName);
		})
		.concat('.');

	npm.load({}, function() {
		function next() {
			if (packages.length > 0) {
				npm.commands.publish([packages.pop()], next);
			} else {
				done();
			}
		}
		next();
	});
});

