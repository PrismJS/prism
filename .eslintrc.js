/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	extends: 'eslint:recommended',
	rules: {
		'no-use-before-define': ['error', { 'functions': false, 'classes': false }],

		// stylistic rules
		'brace-style': ['warn', '1tbs', { allowSingleLine: true }],
		'no-var': 'error',
		'quotes': ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
		'semi': 'warn',
		'wrap-iife': 'warn',

		// spaces
		'arrow-spacing': 'warn',
		'block-spacing': 'warn',
		'comma-spacing': 'warn',
		'computed-property-spacing': 'warn',
		'func-call-spacing': 'warn',
		'generator-star-spacing': 'warn',
		'key-spacing': 'warn',
		'keyword-spacing': 'warn',
		'no-multi-spaces': ['warn', { ignoreEOLComments: true }],
		'no-trailing-spaces': 'warn',
		'no-whitespace-before-property': 'warn',
		'object-curly-spacing': ['warn', 'always'],
		'rest-spread-spacing': 'warn',
		'semi-spacing': 'warn',
		'space-before-blocks': 'warn',
		'space-before-function-paren': ['warn', { named: 'never' }],
		'space-in-parens': 'warn',
		'space-infix-ops': ['warn', { int32Hint: true }],
		'space-unary-ops': 'warn',
		'switch-colon-spacing': 'warn',
		'template-curly-spacing': 'warn',
		'yield-star-spacing': 'warn',

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
			},
			rules: {
				'no-var': 'off'
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
			},
			rules: {
				'no-var': 'off'
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
			},
			rules: {
				'no-var': 'off'
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
