export default /** @type {import("../types").LanguageProto} */ ({
	id: 'diff',
	grammar() {
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

		/**
		 * A map from the name of a block to its line prefix.
		 *
		 * @type {Object<string, string>}
		 */
		const PREFIXES = {
			'deleted-sign': '-',
			'deleted-arrow': '<',
			'inserted-sign': '+',
			'inserted-arrow': '>',
			'unchanged': ' ',
			'diff': '!',
		};

		// add a token for each prefix
		Object.keys(PREFIXES).forEach((name) => {
			const prefix = PREFIXES[name];

			const alias = [];
			if (!/^\w+$/.test(name)) { // "deleted-sign" -> "deleted"
				alias.push(/\w+/.exec(name)[0]);
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
						alias: /\w+/.exec(name)[0]
					}
				}
			};
		});

		// make prefixes available to Diff plugin
		Object.defineProperty(diff, 'PREFIXES', {
			value: PREFIXES
		});

		return diff;
	}
});
