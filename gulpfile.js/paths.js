'use strict';

module.exports = {
	componentsFile: 'components.json',
	componentsFileJS: 'components.js',
	components: ['components/**/*.js', '!components/index.js', '!components/**/*.min.js'],
	themes: ['themes/*.css', '!themes/*.min.css'],
	main: [
		'components/prism-core.js',
		'components/prism-markup.js',
		'components/prism-css.js',
		'components/prism-clike.js',
		'components/prism-javascript.js',
		'plugins/file-highlight/prism-file-highlight.js'
	],
	plugins: ['plugins/**/*.js', '!plugins/**/*.min.js'],
	pluginsCSS: ['plugins/**/*.css', '!plugins/**/*.min.css'],
	showLanguagePlugin: 'plugins/show-language/prism-show-language.js',
	autoloaderPlugin: 'plugins/autoloader/prism-autoloader.js',
	changelog: 'CHANGELOG.md'
};
