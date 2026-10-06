// Syntax reference: https://naninovel.com/guide/scenario-scripting

/**
 * @param {RegExp} pattern
 * @param {Record<string, string>} parts
 * @returns {string}
 */
function fill (pattern, parts) {
	return pattern.source.replace(/<(\w+)>/g, (_, name) => parts[name]);
}

/** @type {import('../types.d.ts').LanguageProto<'naniscript'>} */
export default {
	id: 'naniscript',
	alias: 'nani',
	grammar () {
		const expression = /\{(?:\\.|[^\\}\r\n])*\}/.source;
		const string = fill(/"(?:\\.|<expression>|[^"\\{\r\n])*"/, { expression });
		// A value runs across whitespace until the next named parameter, boolean flag or comment.
		const atom = fill(/(?:<string>|<expression>|\\.|[^\s"{\\;])/, { string, expression });
		const value = fill(/<atom>+(?:\s+(?![A-Za-z_]\w*[:!]|![A-Za-z_])<atom>+)*/, { atom });

		const literal = {
			'expression': {
				pattern: RegExp(fill(/(?<!\\)<expression>/, { expression })),
				alias: 'variable',
			},
			'text-id': {
				pattern: /(?<!\\)\|#[^\s|]*\|/,
				alias: 'comment',
			},
		};

		const stringToken = {
			pattern: RegExp(string),
			greedy: true,
			inside: literal,
		};

		/**
		 * @param {string} commands
		 * @param {string} parameters
		 * @param {string} alias
		 * @returns {import('../types.d.ts').GrammarToken[]}
		 */
		const parameterOf = (commands, parameters, alias) => [
			{
				pattern: RegExp(
					fill(/(?<=^(?:@\s*)?(?:<commands>)\s+)<value>/, { commands, value })
				),
				greedy: true,
				alias,
			},
			{
				pattern: RegExp(fill(/(?<=\s(?:<parameters>):)<value>/, { parameters, value })),
				greedy: true,
				alias,
			},
		];

		const command = {
			'command-name': {
				pattern: /^(?:@\s*)?[^\s;]+/,
				alias: 'function',
			},
			'expression': [
				...parameterOf('if|or|set|unless|while', 'if|or|set|unless', 'variable'),
				literal.expression,
			],
			'label': parameterOf('gosub|goto', 'gosub|goto', 'symbol'),
			'string': stringToken,
			'comment': {
				pattern: /(?<!\\);.*/,
				greedy: true,
			},
			'parameter-name': {
				pattern: /(?<=\s)(?:[A-Za-z_]\w*[:!]|![A-Za-z_]\w*)/,
				alias: 'attr-name',
				inside: {
					'punctuation': /:/,
					'boolean': /!/,
				},
			},
			'parameter-value': {
				pattern: RegExp(value),
				greedy: true,
				alias: 'attr-value',
				inside: {
					'string': stringToken,
					...literal,
				},
			},
		};

		// Keeps the wrapper of inline commands and command tags out of reach of greedy patterns.
		const body = {
			pattern: /\S.*/,
			inside: command,
		};

		return {
			'comment': /(?<=^[ \t]*);.*/m,
			'label': {
				pattern: /(?<=^[ \t]*)#.*/m,
				alias: 'symbol',
				inside: {
					'comment': /(?<!\\);.*/,
				},
			},
			'command': {
				pattern: /(?<=^[ \t]*)@.*/m,
				inside: command,
			},
			'author': {
				pattern: /(?<=^[ \t]*)[^\s"\\{]+:(?=[ \t])/m,
				alias: 'attr-value',
				inside: {
					'punctuation': /[.:]/,
				},
			},
			'inline-command': {
				pattern: RegExp(
					fill(/(?<!\\)\[(?:<string>|<expression>|\\.|[^\]"{\\\r\n])*\]/, {
						string,
						expression,
					})
				),
				inside: {
					'punctuation': /^\[|\]$/,
					'command': body,
				},
			},
			...literal,
			'tag': [
				{
					pattern: /(?<!\\)<@[^>\r\n]*>/,
					inside: {
						'punctuation': /^<|>$/,
						'command': body,
					},
				},
				{
					pattern: /(?<!\\)<:[^>\r\n]*>/,
					inside: {
						'punctuation': /^<:|>$/,
						'expression': {
							pattern: /.+/,
							alias: 'variable',
						},
					},
				},
				{
					pattern: /(?<!\\)<\/[^/>\r\n]*\/[^>\r\n]*>/,
					inside: {
						'punctuation': /^<|>$|\//,
						'option': {
							pattern: /[^/]+/,
							alias: 'string',
						},
					},
				},
				/(?<!\\)<[^>\r\n]*>/,
			],
		};
	},
};
