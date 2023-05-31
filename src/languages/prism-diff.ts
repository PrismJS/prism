import type { Grammar, LanguageProto } from '../types';

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

export default {
	id: 'diff',
	grammar() {
		const diff: Grammar = {
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
			const prefix = PREFIXES[name as keyof typeof PREFIXES];

			const alias = [];
			const mainName = /\w+/.exec(name)?.[0] || name;
			if (mainName !== name) { // "deleted-sign" -> "deleted"
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
						alias: mainName
					}
				}
			};
		});

		return diff;
	}
} as LanguageProto<'diff'>;
