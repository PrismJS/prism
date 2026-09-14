/**
 * A map from the name of a block to its line prefix.
 */
export const PREFIXES = {
	'deleted-sign': '-',
	'deleted-arrow': '<',
	'inserted-sign': '+',
	'inserted-arrow': '>',
	'unchanged': ' ',
	'diff': '!',
};

/** @type {import('../types.d.ts').LanguageProto<'diff'>} */
export default {
	id: 'diff',
	// `diff:css` highlights a diff of CSS. There is no default inner language.
	inner: null,
	grammar ({ inner }) {
		/** @type {import('../types.d.ts').Grammar} */
		const diff = {
			'coord': [
				// Match all kinds of coord lines (prefixed by "+++", "---" or "***").
				/^(?:\*{3}|-{3}|\+{3}).*$/m,
				// Match "@@ ... @@" coord lines in unified diff.
				/^@@.*@@$/m,
				// Match coord lines in normal diff (starts with a number).
				/^\d.*$/m,
			],

			// deleted, inserted, unchanged, diff
		};

		// add a token for each prefix
		Object.keys(PREFIXES).forEach(name => {
			const prefix = PREFIXES[name];

			const alias = [];
			const mainName = /\w+/.exec(name)?.[0] || name;
			if (mainName !== name) {
				// "deleted-sign" -> "deleted"
				alias.push(mainName);
			}
			if (name === 'diff') {
				alias.push('bold');
			}

			diff[name] = {
				pattern: RegExp(`^(?:[${prefix}].*(?:\r\n?|\n|(?![\\s\\S])))+`, 'm'),
				alias,
				inside: {
					'prefix': {
						pattern: RegExp(`^[${prefix}]`, 'm'),
						greedy: true,
						alias: mainName,
					},
					// What is left after taking out the prefixes is code in the inner language.
					// Unlike template tags, prefixes don't stand for anything, so they leave no placeholder.
					$inner: inner,
					$placeholder: false,
				},
			};
		});

		return diff;
	},
};
