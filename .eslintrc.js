/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	extends: 'eslint:recommended',
	rules: {
		// stylistic rules
		'quotes': ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
		'semi': 'warn',

		// I turned this rule off because we use `hasOwnProperty` in a lot of places
		// TODO: Think about re-enabling this rule
		'no-prototype-builtins': 'off',
		// TODO: Think about re-enabling this rule
		'no-cond-assign': 'off',
		// TODO: Think about re-enabling this rule
		'no-inner-declarations': 'off',
		// TODO: Think about re-enabling this rule
		'no-sparse-arrays': 'off',

		// turning off some regex rules
		// these are supposed to protect against accidental use but we need those quite often
		'no-control-regex': 'off',
		'no-empty-character-class': 'off',
		'no-useless-escape': 'off'
	},
	ignorePatterns: [
		'*.min.js',
		'vendor/',
		'utopia.js',
		'docs/',
		'components.js',
		'prism.js',
		'node_modules'
	],

	overrides: [
		{
			// Languages and plugins
			files: [
				'components/*.js',
				'plugins/*/prism-*.js'
			],
			excludedFiles: 'components/index.js',
			env: {
				browser: true,
				node: true,
				worker: true
			},
			globals: {
				'Prism': true
			}
		},
		{
			// `loadLanguages` function for Node.js
			files: 'components/index.js',
			env: {
				es6: true,
				node: true
			},
			parserOptions: {
				ecmaVersion: 6
			},
			globals: {
				'Prism': true
			}
		},
		{
			// Gulp and Danger
			files: 'dependencies.js',
			env: {
				browser: true,
				node: true
			}
		},
		{
			// The scripts that run on our website
			files: 'assets/*.js',
			env: {
				browser: true
			},
			globals: {
				'components': true,
				'getLoader': true,
				'PrefixFree': true,
				'Prism': true,
				'Promise': true,
				'saveAs': true,
				'$': true,
				'$$': true,
				'$u': true
			}
		},
		{
			// Test files
			files: 'tests/**',
			env: {
				es6: true,
				mocha: true,
				node: true
			},
			parserOptions: {
				ecmaVersion: 2018
			}
		},
		{
			// Gulp and Danger
			files: [
				'gulpfile.js/**',
				'dangerfile.js'
			],
			env: {
				es6: true,
				node: true
			},
			parserOptions: {
				ecmaVersion: 2018
			}
		},
		{
			// This file
			files: '.eslintrc.js',
			env: {
				node: true
			}
		},
	]
};
