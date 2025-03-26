/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	plugins: ['import', 'jsdoc', 'regexp'],
	env: {
		es6: true,
	},
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {
		'no-use-before-define': ['error', { 'functions': false, 'classes': false }],
		'eqeqeq': ['error', 'always', { 'null': 'ignore' }],

		// imports
		'import/extensions': ['warn', 'never'],
		'import/order': [
			'warn',
			{
				groups: [
					['builtin', 'external'],
					'internal',
					'parent',
					'sibling',
					'index',
					'object',
					'type',
				],
				alphabetize: { order: 'asc', caseInsensitive: true },
			},
		],
		'sort-imports': ['warn', { ignoreDeclarationSort: true }],

		// stylistic rules
		'no-var': 'error',
		'object-shorthand': ['warn', 'always', { avoidQuotes: true }],
		'one-var': ['warn', 'never'],
		'prefer-arrow-callback': 'warn',
		'prefer-const': ['warn', { 'destructuring': 'all' }],
		'prefer-spread': 'error',

		// JSDoc
		'jsdoc/check-alignment': 'warn',
		'jsdoc/check-syntax': 'warn',
		'jsdoc/check-param-names': 'warn',
		'jsdoc/require-hyphen-before-param-description': ['warn', 'never'],
		'jsdoc/check-tag-names': 'warn',
		'jsdoc/check-types': 'warn',
		'jsdoc/empty-tags': 'warn',
		'jsdoc/newline-after-description': 'warn',
		'jsdoc/require-param-name': 'warn',
		'jsdoc/require-property-name': 'warn',

		// regexp
		'regexp/no-dupe-disjunctions': 'error',
		'regexp/no-empty-alternative': 'error',
		'regexp/no-empty-capturing-group': 'error',
		'regexp/no-empty-lookarounds-assertion': 'error',
		'regexp/no-lazy-ends': 'error',
		'regexp/no-obscure-range': 'error',
		'regexp/no-optional-assertion': 'error',
		'regexp/no-standalone-backslash': 'error',
		'regexp/no-super-linear-backtracking': 'error',
		'regexp/no-unused-capturing-group': 'error',
		'regexp/no-zero-quantifier': 'error',
		'regexp/optimal-lookaround-quantifier': 'error',

		'regexp/match-any': 'warn',
		'regexp/negation': 'warn',
		'regexp/no-dupe-characters-character-class': 'warn',
		'regexp/no-trivially-nested-assertion': 'warn',
		'regexp/no-trivially-nested-quantifier': 'warn',
		'regexp/no-useless-character-class': 'warn',
		'regexp/no-useless-flag': 'warn',
		'regexp/no-useless-lazy': 'warn',
		'regexp/no-useless-range': 'warn',
		'regexp/prefer-d': ['warn', { insideCharacterClass: 'ignore' }],
		'regexp/prefer-plus-quantifier': 'warn',
		'regexp/prefer-question-quantifier': 'warn',
		'regexp/prefer-star-quantifier': 'warn',
		'regexp/prefer-w': 'warn',
		'regexp/sort-alternatives': 'warn',
		'regexp/sort-flags': 'warn',
		'regexp/strict': 'warn',

		// I turned this rule off because we use `hasOwnProperty` in a lot of places
		// TODO: Think about re-enabling this rule
		'no-prototype-builtins': 'off',
		// TODO: Think about re-enabling this rule
		'no-inner-declarations': 'off',
		// TODO: Think about re-enabling this rule
		'no-sparse-arrays': 'off',

		// turning off some regex rules
		// these are supposed to protect against accidental use but we need those quite often
		'no-control-regex': 'off',
		'no-empty-character-class': 'off',
		'no-useless-escape': 'off',
	},
	settings: {
		jsdoc: { mode: 'typescript' },
		regexp: {
			// allow alphanumeric and cyrillic ranges
			allowedCharacterRanges: ['alphanumeric', 'а-я', 'А-Я'],
		},
	},
	ignorePatterns: [
		'vendor/',
		'node_modules',
		'dist/',
		'benchmark/downloads/',
		'benchmark/remotes/',
	],

	overrides: [
		{
			files: ['*.ts'],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: ['./tsconfig.json'],
			},
			plugins: ['@typescript-eslint'],
			extends: [
				'eslint:recommended',
				'plugin:@typescript-eslint/recommended',
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
				'plugin:eslint-comments/recommended',
			],
			rules: {
				'no-use-before-define': 'off',

				// I turned this rule off because we use `hasOwnProperty` in a lot of places
				// TODO: Think about re-enabling this rule
				'no-prototype-builtins': 'off',

				// turning off some regex rules
				// these are supposed to protect against accidental use but we need those quite often
				'no-control-regex': 'off',
				'no-empty-character-class': 'off',
				'no-useless-escape': 'off',

				'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],

				// type rules
				'@typescript-eslint/ban-types': [
					'error',
					{
						'types': {
							// un-ban a type that's banned by default
							'{}': false,
						},
						'extendDefaults': true,
					},
				],
				'@typescript-eslint/consistent-type-imports': [
					'warn',
					{ disallowTypeAnnotations: true },
				],
			},
		},
		{
			// Core
			files: ['src/core/**/*.ts'],
			env: {
				browser: true,
				node: true,
			},
		},
		{
			// Browser-specific parts
			files: ['src/auto-start.ts'],
			env: {
				browser: true,
			},
		},
		{
			// Plugins
			files: ['src/plugins/**/*.ts'],
			env: {
				browser: true,
			},
		},
		{
			// The scripts that run on our website
			files: 'website/assets/*.js',
			env: {
				browser: true,
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
				'$u': true,
			},
			rules: {
				'no-var': 'off',
			},
		},
		{
			// Test files
			files: 'tests/**',
			env: {
				mocha: true,
				node: true,
			},
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: ['./tests/tsconfig.json'],
			},
		},
		{
			// Benchmark
			files: ['benchmark/**'],
			env: {
				node: true,
			},
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: ['./benchmark/tsconfig.json'],
			},
		},
		{
			// Scripts
			files: ['scripts/**'],
			env: {
				node: true,
			},
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: ['./scripts/tsconfig.json'],
			},
		},
		{
			// Gulp, Danger, and benchmark
			files: ['gulpfile.js/**', 'dangerfile.js'],
			env: {
				node: true,
			},
		},
		{
			// This file
			files: '.eslintrc.js',
			env: {
				node: true,
			},
		},
	],
	'extends': ['plugin:prettier/recommended', 'eslint:recommended'],
};
