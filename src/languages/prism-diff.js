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

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'diff',
	grammar() {
		/** @type {import("../types").Grammar} */
		const diff = {
			'coord': [
				// Match all kinds of coord lines (prefixed by "+++", "---" or "***").
				/^(?:\*{3}|-{3}|\+{3}).*$/m,
				// Match "@@ ... @@" coord lines in unified diff.
				/^@@.*@@$/m,
				// Match coord lines in normal diff (starts with a number).
				/^\d.*$/m
			]

			// deleted, inserted, unchanged, diff
		};

		// add a token for each prefix
		Object.keys(PREFIXES).forEach((name) => {
			const prefix = PREFIXES[/** @type {keyof PREFIXES} */ (name)];

			const alias = [];
			const mainName = /\w+/.exec(name)?.[0] || name;
			if (mainName !== name) { // "deleted-sign" -> "deleted"
				alias.push(mainName);
			}
			if (name === 'diff') {
				alias.push('bold');
			}

			diff[name] = {
				pattern: RegExp('^(?:[' + prefix + '].*(?:\r\n?|\n|(?![\\s\\S])))+', 'm'),
				alias,
				inside: {
					'line': {
						pattern: /(.)(?=[\s\S]).*(?:\r\n?|\n)?/,
						lookbehind: true
					},
					'prefix': {
						pattern: /[\s\S]/,
						alias: mainName
					}
				}
			};
		});

		return diff;
	}
});
