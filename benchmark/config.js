/** @type {Config}
 *
 * @typedef Config
 * @property {ConfigOptions} options
 * @property {ConfigRemote[]} remotes
 * @property {Object<string, ConfigCase>} cases
 *
 * @typedef ConfigOptions
 * @property {'tokenize' | 'highlight'} testFunction
 * @property {number} maxTime in seconds
 * @property {string} [language] An optional comma separated list of languages than, if defined, will be the only
 * languages for which the benchmark will be run.
 *
 * @typedef ConfigRemote
 * @property {string} repo
 * @property {string} [branch='master']
 *
 * @typedef ConfigCase
 * @property {string | string[]} [extends]
 * @property {string | string[]} [files]
*/
const config = {
	options: {
		testFunction: 'tokenize',
		maxTime: 3
	},

	remotes: [
		/**
		 * This will checkout a specific branch from a given repo.
		 *
		 * If no branch is specified, the master branch will be used.
		 */

		{
			repo: 'https://github.com/PrismJS/prism.git'
		},
	],

	cases: {
		'css': {
			files: [
				'../../style.css'
			]
		},
		'css!+css-extras': { extends: 'css' },
		'javascript': {
			extends: 'json',
			files: [
				'../../prism.js',
				'prism.min.js',
				'../../scripts/utopia.js',
				'https://code.jquery.com/jquery-3.4.1.js'
			]
		},
		'json': {
			files: [
				'../../components.json',
				'../../package-lock.json'
			]
		},
		'markup': {
			files: [
				'../../download.html',
				'../../index.html'
			]
		},
		'markup!+css+javascript': { extends: 'markup' }
	}
};

module.exports = config;
