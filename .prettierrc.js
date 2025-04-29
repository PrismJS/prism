/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
export default {
	plugins: [
		'@ianvs/prettier-plugin-sort-imports',
		'prettier-plugin-brace-style',
		'prettier-plugin-space-before-function-paren',
		'prettier-plugin-merge',
	],
	importOrder: [
		'<BUILTIN_MODULES>', // Node.js built-in modules
		'<THIRD_PARTY_MODULES>', // Imports not matched by other special words or groups.
		'^\\.\\./', // Parent imports
		'^\\./', // Sibling imports
		'^\\.$', // Index file
		'<TYPES>', // Type imports
	],
	braceStyle: 'stroustrup',
	arrowParens: 'avoid',
	bracketSpacing: true,
	endOfLine: 'auto',
	semi: true,
	singleQuote: true,
	tabWidth: 4,
	useTabs: true,
	trailingComma: 'es5',
	quoteProps: 'preserve',
	printWidth: 100,
	overrides: [
		{
			files: ['*.yml', '*.yaml'],
			options: {
				tabWidth: 2,
			},
		},
		{
			files: '*.css',
			options: {
				singleQuote: false,
			},
		},
	],
};
