import path from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsEslintParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintCommentsPlugin from 'eslint-plugin-eslint-comments';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import regexpPlugin from 'eslint-plugin-regexp';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = [
	{
		ignores: ['benchmark/downloads', 'benchmark/remotes', 'dist', 'node_modules', 'types'],
	},
	js.configs.recommended,
	{
		plugins: {
			jsdoc: jsdocPlugin,
			regexp: regexpPlugin,
		},
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		rules: {
			'no-use-before-define': ['warn', { 'functions': false, 'classes': false }],
			'eqeqeq': ['warn', 'always', { 'null': 'ignore' }],

			// stylistic rules
			'no-var': 'warn',
			'object-shorthand': ['warn', 'always', { avoidQuotes: true }],
			'one-var': ['warn', 'never'],
			'prefer-arrow-callback': 'warn',
			'prefer-const': 'off',
			'prefer-spread': 'warn',

			// JSDoc
			'jsdoc/check-alignment': 'warn',
			'jsdoc/check-syntax': 'warn',
			'jsdoc/check-param-names': 'warn',
			'jsdoc/require-hyphen-before-param-description': ['warn', 'never'],
			'jsdoc/check-tag-names': 'warn',
			'jsdoc/check-types': 'warn',
			'jsdoc/empty-tags': 'warn',
			'jsdoc/tag-lines': [1, 'any', { 'startLines': 1 }],
			'jsdoc/require-param-name': 'warn',
			'jsdoc/require-property-name': 'warn',

			// regexp
			'regexp/no-dupe-disjunctions': 'warn',
			'regexp/no-empty-alternative': 'warn',
			'regexp/no-empty-capturing-group': 'warn',
			'regexp/no-empty-lookarounds-assertion': 'warn',
			'regexp/no-lazy-ends': 'warn',
			'regexp/no-obscure-range': 'warn',
			'regexp/no-optional-assertion': 'warn',
			'regexp/no-standalone-backslash': 'warn',
			'regexp/no-super-linear-backtracking': 'warn',
			'regexp/no-unused-capturing-group': 'warn',
			'regexp/no-zero-quantifier': 'warn',
			'regexp/optimal-lookaround-quantifier': 'warn',

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
	},
	{
		files: ['**/*.ts'],
		plugins: {
			'@typescript-eslint': tsEslintPlugin,
			'eslint-comments': eslintCommentsPlugin,
			'regexp': regexpPlugin,
		},
		languageOptions: {
			parser: tsEslintParser,
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: ['./tsconfig.json'],
			},
		},
		rules: {
			...eslintCommentsPlugin.configs.recommended.rules,
			...tsEslintPlugin.configs.recommended.rules,
			...tsEslintPlugin.configs['recommended-requiring-type-checking'].rules,
			...regexpPlugin.configs.recommended.rules,

			'no-use-before-define': 'off',

			// I turned this rule off because we use `hasOwnProperty` in a lot of places
			// TODO: Think about re-enabling this rule
			'no-prototype-builtins': 'off',

			// turning off some regex rules
			// these are supposed to protect against accidental use but we need those quite often
			'no-control-regex': 'off',
			'no-empty-character-class': 'off',
			'no-useless-escape': 'off',

			'eslint-comments/disable-enable-pair': ['warn', { allowWholeFile: true }],

			// Allow {} type
			'@typescript-eslint/no-empty-object-type': 'off',

			'@typescript-eslint/consistent-type-imports': [
				'warn',
				{ disallowTypeAnnotations: true },
			],

			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-floating-promises': 'off',
			'@typescript-eslint/await-thenable': 'off',
		},
	},
	{
		// Browser-specific parts
		files: ['src/global.ts'],
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},
	{
		// Plugins
		files: ['src/plugins/**/*.ts'],
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},
	{
		// Test files
		files: ['tests/**'],
		languageOptions: {
			globals: {
				...globals.mocha,
				...globals.node,
			},
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: ['./tests/tsconfig.json'],
			},
		},
	},
	{
		// Benchmark
		files: ['benchmark/**'],
		languageOptions: {
			globals: {
				...globals.node,
			},
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: ['./benchmark/tsconfig.json'],
			},
		},
	},
	{
		// Scripts
		files: ['scripts/**'],
		languageOptions: {
			globals: {
				...globals.node,
			},
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: ['./scripts/tsconfig.json'],
			},
		},
	},
	{
		// Danger
		files: ['dangerfile.js'],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
	{
		// This file
		files: ['eslint.config.mjs'],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
	eslintConfigPrettier,
];

export default defineConfig(replaceErrorsWithWarnings(config));

/*
 * Many recommended ESLint configs (such as those from @typescript-eslint) default to "error" severity for some rules.
 * However, we want all rules only to warn, not error.
 * This function recursively traverses the config and downgrades all "error" severities to "warn".
 * This ensures a consistent linting experience, even when extending third-party configs that use "error" by default.
 */
function replaceErrorsWithWarnings (config) {
	if (Array.isArray(config)) {
		return config.map(replaceErrorsWithWarnings);
	}

	if (typeof config === 'object' && config !== null) {
		const newConfig = { ...config };

		if (newConfig.rules) {
			newConfig.rules = Object.fromEntries(
				Object.entries(newConfig.rules).map(([rule, setting]) => {
					if (setting === 'error' || setting === 2) {
						return [rule, 'warn'];
					}

					if (Array.isArray(setting) && (setting[0] === 'error' || setting[0] === 2)) {
						return [rule, ['warn', ...setting.slice(1)]];
					}

					return [rule, setting];
				})
			);
		}

		if (newConfig.overrides) {
			newConfig.overrides = replaceErrorsWithWarnings(newConfig.overrides);
		}

		return newConfig;
	}

	return config;
}
