'use strict';

module.exports = {
	componentsFile: 'components.json',
	componentsFileJS: 'components.js',
	components: ['components/**/*.js', '!components/index.js', '!components/**/*.min.js'],
	themes: ['themes/*.css', '!themes/*.min.css'],
	pluginsCSS: ['src/plugins/**/*.css'],
	changelog: 'CHANGELOG.md'
};
