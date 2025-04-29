/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
export default {
	plugins: [
		'@trivago/prettier-plugin-sort-imports',
		'prettier-plugin-brace-style',
		'prettier-plugin-space-before-function-paren',
		'prettier-plugin-merge',
	],
	importOrder: [
		// Node.js built-ins. Accept both “node:module” and “module”.
		'^(node:|fs|path|os|crypto|stream|http|https|zlib|url|util|assert|buffer|events|child_process|cluster|dns|net|tls|readline|repl|vm|worker_threads)',
		'^[a-z@]', // Custom modules
		'^\\.\\./', // Parent imports
		'^\\./', // Sibling imports
		'^\\.$', // Index file
	],
	importOrderSortSpecifiers: true, // Sort named imports { a, b, c }
	importOrderCaseInsensitive: true,
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
