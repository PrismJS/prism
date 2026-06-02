/** @type {LanguageProto<'dotenv'>} */
export default {
	id: 'dotenv',
	optional: 'bash',
	grammar () {
		/**
		 * @param {RegExp} prefix
		 * @returns {Array<GrammarToken>}
		 */
		const commonPatterns = prefix => {
			return [
				{
					pattern: RegExp(
						prefix.source +
							/(?:-?[1-9]\d*|0)(?:\\.\d+)?(?=\s*\}|\s[^}]+$|\s*$|"$)/.source
					),
					alias: 'number',
				},
				{
					pattern: RegExp(prefix.source + /(?:false|true)(?=\s*\}|\s[^}]+$|\s*$)/.source),
					alias: 'boolean',
				},
				{
					// Ignore leading and trailing whitespace characters
					pattern: RegExp(prefix.source + /\S[^}]*?\S(?=\s*\})/.source),
					alias: 'string',
				},
			];
		};

		// Based on https://dotenvx.com/docs/env-file
		return {
			'comment':
				/(?:^|(?<=[\s"'`]))#(?![^\n"'`]*["'`])[^\r\n \t]*(?:[ \t]+[^\r\n \t]+)*[ \t]*/,
			'keyword': /^export(?=\s)/m,
			'key': {
				// Allow bare keys (without values)
				pattern: /(?<=^[ \t]*)[a-z_]\w*(?=[ \t]*(?:=|$))/im,
				alias: 'constant',
			},
			'value': [
				{
					pattern: /(?<==\s*)(?:-?[1-9]\d*|0)(?:\.\d+)?(?=\s*$)/,
					alias: 'number',
				},
				{
					pattern: /(?<==\s*)(?:false|true)(?=\s*$)/,
					alias: 'boolean',
				},
				{
					pattern:
						/(?<==\s*)(?:(['"`])(?:\\[\s\S]|(?!\1)[^\\])*?\1|\S(?:.*?\S)?)(?=\s*$|\s+#.*$)/m,
					alias: 'string',
					inside: {
						'command-substitution': {
							// Command substitution is disabled in strings enclosed in "'" (single quotes) and "`" (backticks)
							pattern: /(?<!['`][\s\S]*)\$\(.+\)/,
							inside: {
								'command-substitution-punctuation': {
									pattern: /\$\(|\)/,
									alias: 'punctuation',
								},
								'shell-command': {
									pattern: /.+/,
									inside: 'bash',
								},
							},
						},
						'variable-expansion': {
							// Variable expansion is disabled in strings enclosed in "'" (single quotes) and "`" (backticks)
							pattern: /(?<!['`][\s\S]*)\$(?:\{[^{]+\}|[^\s"]+)/,
							inside: {
								'variable': /(?<=\$\{|\$)[a-z_]\w*/i,
								'default-value': commonPatterns(/(?<=(?::-|-)\s*)/),
								'alternative-value': commonPatterns(/(?<=(?::\+|\+)\s*)/),
								'variable-expansion-punctuation': {
									pattern: /\$\{|:-|:\+|[$}+-]/,
									alias: 'punctuation',
								},
							},
						},
						'escape-sequence': {
							pattern: /\\['"`#\\nrt]/,
							alias: 'char',
						},
						'punctuation': /^['"`]|['"`]$/,
					},
				},
			],
			'assignment-operator': {
				pattern: /=/,
				alias: 'operator',
			},
		};
	},
};

/** @import { GrammarToken, LanguageProto } from '../types.d.ts'; */
