/** @type {import('../types.d.ts').LanguageProto<'mikrotik'>} */
export default {
	id: 'mikrotik',
	optional: 'regex',
	alias: ['routeros', 'ros'],
	grammar () {
		// MikroTik RouterOS Scripting Language Definition
		//
		// This definition highlights RouterOS scripts using structural
		// syntax patterns rather than exhaustive keyword lists. RouterOS constructs
		// are syntactically self-describing:
		//   - Commands are colon-prefixed  → :put, :global, :if
		//   - Paths start with slash       → /ip/firewall/filter
		//   - Parameters use word= syntax  → src-address=10.0.0.1
		//   - Variables are dollar-prefixed → $varName
		//
		// Only small, stable sets (global commands, menu commands, print parameters)
		// are explicitly listed; everything else is matched by pattern.
		// References:
		//   https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting
		//   https://help.mikrotik.com/docs/spaces/ROS/pages/328134/Command+Line+Interface
		//
		// Known limitations (require semantic analysis beyond regex):
		//   1. Multi-line arrays: `{ 1;\n2;\n3 }` is not highlighted as an array.
		//      The pattern intentionally excludes newlines to avoid misidentifying
		//      multi-line code blocks (e.g., `do={ ... }`) as arrays.
		//   2. Sub-menu names in space form: `/tool e-mail send` — only the first
		//      path component (`tool`) is highlighted; the rest look like bare words.
		//      Fixing this would require a full vocabulary list of all sub-menu names.
		//   3. Menu commands in value position: `action=add` — `add` is highlighted
		//      as a command even though it is used as a parameter value here.
		//      There is no regex-based way to distinguish the two contexts.
		//   4. `!` in topic specs: `topics=!ppp` — `!` is highlighted as a logical
		//      operator. The negation-in-topic-spec usage is syntactically identical.
		//   5. Bare property names without `=`: `get $id target-address` — `target-address`
		//      is not highlighted as a parameter because the generic parameter pattern
		//      requires `(?==)`. A bare hyphenated-word pattern would conflict with
		//      hyphenated menu commands (e.g., `monitor-traffic`).

		// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-Globalcommands
		const GLOBAL_COMMANDS = [
			'beep',
			'delay',
			'deserialize',
			'environment',
			'error',
			'execute',
			'find',
			'global',
			'jobname',
			'len',
			'local',
			'log',
			'nothing',
			'onerror',
			'parse',
			'pick',
			'put',
			'range',
			'resolve',
			'retry',
			'rndnum',
			'rndstr',
			'serialize',
			'set',
			'time',
			'timestamp',
			'toarray',
			'tobool',
			'tocrlf',
			'toid',
			'toip',
			'toip6',
			'tolf',
			'tonsec',
			'tonum',
			'tostr',
			'totime',
			'typeof',
		];

		// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-Menuspecificcommands
		const MENU_SPECIFIC_COMMANDS = [
			'add',
			'disable',
			'edit',
			'enable',
			'export',
			'find',
			'flush',
			'get',
			'import',
			'monitor-traffic',
			'print',
			'quit',
			'redo',
			'remove',
			'send',
			'set',
			'undo',
		];

		// Universal boolean-like values that appear across all RouterOS menus
		const PROPERTY_VALUES = ['auto', 'disabled', 'enabled', 'no', 'none', 'yes'];

		// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-printparameters
		const PRINT_PARAMETERS = [
			'about',
			'append',
			'as-string',
			'as-value',
			'brief',
			'count-only',
			'detail',
			'file',
			'follow',
			'follow-only',
			'from',
			'interval',
			'terse',
			'value-list',
			'where',
			'without-paging',
		];

		// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-Datatypes
		const DATA_TYPES = {
			'internal-id': {
				pattern: /(?<=\s)\*(?:[1-9a-f][\da-f]*|0)\b/i,
				alias: 'constant',
			},
			'ip-address': [
				{
					pattern: /\b\d{1,3}(?:\.\d{1,3}){3}\/(?:[0-2]?\d|3[0-2])\b/,
					alias: ['ip-prefix', 'constant'],
				},
				{
					pattern: /\b\d{1,3}(?:\.\d{1,3}){3}\b/,
					alias: 'constant',
				},
			],
			'ip6-address': [
				{
					pattern:
						/(?<!\w)(?:(?:[0-9a-f]{1,4}:){7}[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?)\/(?:1[01]\d|12[0-8]|\d{1,2})\b/i,
					alias: ['ip6-prefix', 'constant'],
				},
				{
					pattern:
						/(?<!\w)(?:(?:[0-9a-f]{1,4}:){7}[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?)\b/i,
					alias: 'constant',
				},
			],
			'date-time': {
				// Combined date-time format: mmm/DD/YYYY HH:MM:SS (e.g., may/13/1982 16:30:15)
				// https://help.mikrotik.com/docs/spaces/ROS/pages/40992866/Clock
				pattern:
					/\b(?:apr|aug|dec|feb|jan|jul|jun|mar|may|nov|oct|sep)\/\d{1,2}\/\d{4} \d+:\d{1,2}(?::\d{1,2}(?:\.\d+)?)?\b/i,
				alias: 'constant',
			},
			'date': {
				// Date format: mmm/DD/YYYY (e.g., may/13/1982)
				// https://help.mikrotik.com/docs/spaces/ROS/pages/40992866/Clock
				pattern: /\b(?:apr|aug|dec|feb|jan|jul|jun|mar|may|nov|oct|sep)\/\d{1,2}\/\d{4}\b/i,
				alias: 'constant',
			},
			'time': [
				{
					// HH:MM:SS or HH:MM:SS.ms format (e.g., 16:30:15, 0:45, 0:3:2.05)
					// https://help.mikrotik.com/docs/spaces/ROS/pages/40992866/Clock
					pattern: /\b\d+:\d{1,2}(?::\d{1,2}(?:\.\d+)?)?\b/,
					alias: 'constant',
				},
				{
					// Numeric values with unit suffixes (e.g., 1d, 2h30m, 45s, 500ms, 1w)
					// Supports: s (seconds), m (minutes), h (hours), d (days), w (weeks), ms (milliseconds)
					pattern: /\b\d+(?:[dhmsw]|ms)(?:[ \t]*\d+(?:[dhmsw]|ms))*\b/i,
					alias: ['with-units', 'constant'],
				},
			],
			// Number pattern: matches positive numbers only (hexadecimal: 0-9, a-f)
			// The minus sign (-) is handled by the arithmetic-operator pattern.
			// Letter-starting hex numbers use (?!-[a-z]) to avoid consuming the first letter of
			// kebab-case identifiers (e.g. `e-mail`): without this, `e` would be matched as a
			// number token, leaving `-mail` as a new segment where `-` would falsely match as an
			// arithmetic operator.
			'number': /\b(?:[1-9][\da-f]*|[a-f][\da-f]*(?!-[a-z])|0)\b/i,

			'boolean': /\b(?:false|true)\b/,
		};

		// Common variable patterns for `$`-based variable references
		const VARIABLE_PATTERNS = [
			{
				// Quoted variable after `$`: `$"var-name"`
				// Use (?:[^"\\]|\\.)* instead of [^"\\]*(?:\\.[^"\\]*)* to avoid exponential backtracking
				pattern: /(?<=\$)"(?:[^"\\]|\\.)*"/,
				greedy: true,
			},
			{
				// Unquoted variable after `$`: `$varName`
				pattern: /(?<=\$)[a-z\d]+/i,
				greedy: true,
			},
		];

		/**
		 * @param {string} alias
		 * @param {string|string[]|undefined} to
		 * @returns {string|string[]}
		 */
		function addAlias (alias, to) {
			if (!to) {
				return alias;
			}

			return Array.isArray(to) ? [alias, ...to] : [alias, to];
		}

		/**
		 * Converts DATA_TYPES entries into pattern objects with aliases.
		 *
		 * @returns {Array}
		 */
		function getDataTypesPatterns () {
			return Object.entries(DATA_TYPES)
				.map(([key, value]) => {
					if (value instanceof RegExp) {
						return {
							pattern: value,
							alias: key,
						};
					}

					if (Array.isArray(value)) {
						return value.map(v => ({
							...v,
							alias: addAlias(key, v.alias),
						}));
					}

					return {
						...value,
						alias: addAlias(key, value.alias),
					};
				})
				.flat();
		}

		/**
		 * Builds a regex pattern that matches nested structures with a limited depth.
		 * We use it to match balanced delimiters, such as parentheses, brackets, or custom tokens (e.g., `$[...]` and `$(...)`).
		 *
		 * @param {string} openToken e.g. `$(` or `(` or `[`
		 * @param {string} closeToken e.g. `)` or `]`
		 * @param {object} options
		 * @param {number} [options.depth=3] maximum nesting depth
		 * @param {string} [options.flags=''] regex flags
		 * @param {boolean} [options.captureInner=false] whether to capture the open/close tokens or use lookarounds to get inner content only
		 * @returns {RegExp}
		 */
		function buildNestedRegex (
			openToken,
			closeToken,
			{ depth = 3, flags = '', captureInner = false } = {}
		) {
			// Escape characters for regex patterns
			const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

			// last char of openToken is the nesting char; prefix is anything before it (e.g. '$' from '$(')
			let [prefix, openerChar] = openToken;
			if (!openerChar) {
				// openToken is a single character string; prefix is empty
				prefix = '';
			}
			else {
				// openToken is a string with a prefix and a single character; remove the prefix from openToken
				openToken = openerChar;
			}

			prefix = escape(prefix);
			openToken = escape(openToken);
			closeToken = escape(closeToken);

			// Single non-special char (or escaped char, or line continuation)
			// Line continuation: backslash followed by optional \r and required \n
			const atom = `[^${openToken}${closeToken}\\\\]|${/\\./.source}|\\\\\\r?\\n`;

			// Build depth-limited pattern recursively:
			// content_0 = (?:atom)+
			// content_k = (?: atom | opener content_{k-1} closer )+
			// Each outer iteration matches exactly one atom or one nested pair,
			// avoiding nested quantifiers that cause exponential backtracking.
			let prev = `(?:${atom})+`; // content_0
			for (let level = 1; level <= depth; level++) {
				prev = `(?:(?:${atom})|(?:${openToken}${prev}${closeToken}))+`;
			}

			return new RegExp(
				captureInner
					? `(?<=${prefix}${openToken})${prev}(?=${closeToken})`
					: `${prefix}${openToken}${prev}${closeToken}`,
				flags
			);
		}

		// Shared inside grammar for string tokens (top-level strings and array string items)
		const STRING_INSIDE = {
			// Expressions inside strings: `$[...]` and `$(...)`
			// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-ConcatenationOperators
			'expression': {
				pattern: new RegExp(
					buildNestedRegex('$(', ')').source + '|' + buildNestedRegex('$[', ']').source
				),
				inside: {
					'begin-of-expression': {
						pattern: /^\$[[(]/,
						alias: 'punctuation',
					},
					'end-of-expression': {
						pattern: /[\])]$/,
						alias: 'punctuation',
					},
					$rest: 'mikrotik',
				},
			},
			'variable': VARIABLE_PATTERNS,
			'substitution-operator': {
				pattern: /\$$/,
				alias: 'operator',
			},
			// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-ConstantEscapeSequences
			'escape-sequence': {
				pattern: /\\(?:["\\nrt$_abfv]|[0-9A-F]{2})/,
				alias: 'char',
			},
		};

		return {
			'comment': {
				pattern: /(?<=^|\s)#.*$/m,
				greedy: true,
			},

			// Note: Only arrays defined in one line are supported; they should always end with `;`!
			// Arrays appear in assignments or function calls, not as standalone scopes
			'array': {
				// Match `{ ... }` that is NOT after `do=`, `else=`, and appears in array contexts
				// Arrays are typically: :local arr {1;2;3}, :put {1;2;3}, or {1;2;3},5
				// Scopes are: `do={...}`, `else={...}`, or standalone blocks
				// Exclude `do={` and `else={` by checking that we're not immediately after `do=` or `else=`
				pattern: /(?<!do=)(?<!else=)\{[^{}\r\n]*\}(?=\s*[;=,)]|\s*$)/,
				greedy: true,
				inside: {
					'punctuation': [
						{
							pattern: /^\{/,
							alias: 'begin-of-array',
						},
						{
							pattern: /\}$/,
							alias: 'end-of-array',
						},
					],
					'array-item': [
						{
							// Array items with keys: "key"=value or key=value
							// `(?<=[\s;]|^)` accounts for `;` separating items (e.g., the second item in `{"k1"=v1;"k2"=v2}`)
							pattern: /(?<=[\s;]|^)[^;=]+=[^;]+(?=;|$)/,
							inside: {
								'key': {
									pattern: /(?:"[^"]+"|[^\s=][^=]*)(?==)/,
									inside: {
										'punctuation': /^"|"$/,
									},
								},
								'value': [
									...getDataTypesPatterns(),
									// Fallback for values with unknown data type
									/(?<==)[^;]+/,
								],
								'operator': /=/,
							},
						},
						// Array items without keys: number, boolean, etc.
						// Append (?=;|$) so each value is bounded by the next delimiter or end of array.
						...getDataTypesPatterns().map(v => ({
							...v,
							pattern: new RegExp(`${v.pattern.source}(?=;|$)`, v.pattern.flags),
						})),
						// String array items: "hello", "escaped \n", "interpolated $var"
						{
							pattern: /"(?:\\.|[^"\\])*"(?=;|$)/,
							alias: 'string',
							inside: STRING_INSIDE,
						},

						// Fallback for values without keys and unknown data type
						/(?<=[\s{};]|^)[^;=]+(?=;|$)/,
					],
					'array-item-delimiter': {
						pattern: /;/,
						alias: 'punctuation',
					},
				},
			},

			'regex': {
				// Optionally captures the parameter name before `~`: `name~"pattern"`
				pattern: /(?:(?<=\s)[a-z][\w-]+)?~"(?:\\.|[^"\\])*"/i,
				greedy: true,
				inside: {
					'parameter': {
						// Parameter name before the `~` operator: `name` in `name~"pattern"`
						pattern: /^[a-z][\w-]+/i,
						alias: 'property',
					},
					'operator': {
						pattern: /^~/,
						alias: 'regex-operator',
					},
					'punctuation': /^"|"$/,
					// Variables are interpolated inside regex strings, just like in regular strings.
					// Unlike VARIABLE_PATTERNS (which use lookbehind and leave `$` as a text node),
					// these patterns include `$` in the match so it isn't claimed by the regex
					// language's `anchor` token via `$rest: 'regex'`.
					// Only simple `$varName` references are supported here. Quoted variable references
					// (`$"var-name"`) would appear as `$\"var-name\"` inside a regex string, but
					// this is too niche to support now — add if real-world demand arises.
					'variable': [
						{
							pattern: /\$[a-z\d]+/i,
							greedy: true,
							inside: {
								'substitution-operator': {
									pattern: /^\$/,
									alias: 'operator',
								},
							},
						},
					],
					$rest: 'regex',
				},
			},

			// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-Variables
			'variable': [
				// Definition
				{
					// Quoted variable after `:(global|local|set)`: `"var-name"`
					// Use (?:[^"\\]|\\.)* instead of [^"\\]*(?:\\.[^"\\]*)* to avoid exponential backtracking
					pattern: /(?<=:(?:global|local|set)\s+)"(?:[^"\\]|\\.)*"/,
					greedy: true,
				},
				{
					// Unquoted variable in declaration or loop: `varName`
					// Covers `:global varName`, `:local varName`, `:set varName`, `:for varName`, `:foreach varName`
					pattern: /(?<=:(?:for|foreach|global|local|set)\s+)[A-Za-z\d]+/,
					greedy: true,
				},

				// Reference
				...VARIABLE_PATTERNS,
			],

			'subexpression': {
				// Depth 3 nested parentheses
				pattern: buildNestedRegex('(', ')', {
					captureInner: true,
				}),
				greedy: true,
				inside: 'mikrotik',
			},

			'command-substitution': {
				// Depth 3 nested square brackets
				pattern: buildNestedRegex('[', ']', {
					captureInner: true,
				}),
				greedy: true,
				alias: 'command-concatenation',
				inside: 'mikrotik',
			},

			'string': {
				pattern:
					/(?<!\$\s?)(?<!\b:(?:global|local|set)\s)(")(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
				greedy: true,
				inside: STRING_INSIDE,
			},

			'keyword': [
				// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-Whitespacebetweentokens
				/\b(?:from|in|on-error|step|to)(?==)/,
				{
					// `else` could be part of the previous pattern, but we need to assign it a different alias;
					// and since it must follow by `=`, we can't make it part of the general keywords pattern below
					pattern: /\belse(?==)/,
					alias: 'control-flow',
				},
				{
					// Loops and conditional statements (https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-Loopsandconditionalstatements)
					pattern: /\b(?:do|for|foreach|if|while)(?=[\s{=[(])/,
					alias: 'control-flow',
				},
				{
					// `once` keyword for monitoring commands (e.g., `/interface monitor-traffic ether1 once`)
					pattern: /\bonce\b/,
				},
			],

			'parameter': [
				// Print parameters can appear with `=` (e.g., `print from=0`) or without (e.g., `print brief`)
				// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-printparameters
				{
					pattern: new RegExp(`(?<=\\s)(?:${PRINT_PARAMETERS.join('|')})(?==)`),
					alias: ['print-parameter', 'property'],
				},
				{
					pattern: new RegExp(
						`(?<=\\s)(?:${PRINT_PARAMETERS.join('|')})(?![\\w-])(?!\\s*=)`
					),
					alias: ['print-parameter', 'property'],
				},
				{
					// Generic parameter: any kebab-case word followed by `=`
					// Covers all RouterOS parameters including those not explicitly listed above
					// Examples: src-address=, connection-state=, tx-power-mode=
					pattern: /(?<=\s)[a-z][\w-]+(?==)/i,
					alias: 'property',
				},
			],

			'command': [
				{
					// Generic menu path: any word (including hyphens) after `/`
					// Requires the first character to be a letter to avoid consuming digit-only
					// sequences that are part of dates (jan/01/2024) or IP prefixes (10.0.0.0/24)
					// Examples: /ip, /interface, /dhcp-server, /routing/bgp
					pattern: /(?<=\/)[a-z][\w-]*/i,
					alias: ['path', 'function'],
				},
				{
					// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-Globalcommands
					pattern: new RegExp('(?<=:)(?:' + GLOBAL_COMMANDS.join('|') + ')\\b'),
					alias: ['global-command', 'builtin'],
				},
				{
					// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-Functions
					pattern: /(?<=:)return\b/,
					alias: ['function-return', 'builtin'],
				},
				{
					// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-Menuspecificcommands
					pattern: new RegExp('\\b(?:' + MENU_SPECIFIC_COMMANDS.join('|') + ')\\b'),
					alias: ['menu-specific-command', 'common-command', 'function'],
				},
			],

			'prefix': {
				pattern: /[:/]$/,
				alias: 'punctuation',
			},

			'end-of-command': {
				pattern: /;(?=\s|$)/,
				alias: 'punctuation',
			},

			'property-value': {
				// Universal boolean-like values appearing after `=` or `,` in parameter lists
				// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting
				pattern: new RegExp(
					'(?<=,|=)\\s*(?:' + PROPERTY_VALUES.join('|') + ')(?=$|[^./\\w-])'
				),
				alias: 'attr-value',
			},

			...DATA_TYPES,

			'operator': [
				{
					pattern: /->/,
					alias: 'access-array-element-operator',
				},
				{
					// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-ArithmeticOperators
					// `-` is excluded when flanked by letters on both sides to avoid matching hyphens
					// in kebab-case identifiers (e.g., `target-address`, `src-address`).
					// It still matches unary (`-42`), binary with spaces (`$a - $b`), and
					// binary between non-letter tokens (`a-3` where `a` is a hex digit).
					pattern: /[%*/+]|(?<![a-z])-|-(?![a-z])/i,
					alias: 'arithmetic-operator',
				},
				{
					// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-LogicalOperators
					pattern: /!(?!=)|&&|\|\||\b(?:and|in|or)\b/,
					alias: 'logical-operator',
				},
				{
					// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-BitwiseOperators
					pattern: /<<|>>|[~|^&]/,
					alias: 'bitwise-operator',
				},
				{
					// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-RelationalOperators
					pattern: /[<>]=?|!=/,
					alias: 'relational-operator',
				},
				{
					// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-ConcatenationOperators
					// Matches dots and commas used for concatenation, avoiding false positives in filenames (e.g., `file.txt`)
					// Matches when NOT between two word characters (excludes `file.txt`) OR when adjacent to quotes/brackets/operators
					pattern: /\B[.,]\B|(?<=[")\]}$])[.,]|[.,](?=["[({$])/,
					alias: 'concatenation-operator',
				},
				{
					// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-OtherOperators
					// Matches parentheses used for grouping (e.g., `(4+5)`)
					// Note: `subexpression` uses `captureInner: true`, so parentheses are still available here
					pattern: /[()]/,
					alias: 'grouping-operator',
				},
				{
					// Substitution operator: matches $ followed by a variable
					// Examples: $"my-var", $myVar, $varName
					// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-OtherOperators
					pattern: /\$$/,
					alias: 'substitution-operator',
				},
				/=/,
			],

			'line-joining': {
				// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-Linejoining
				pattern: /\\(?=\r?\n|$)/m,
				alias: 'punctuation',
			},

			'begin-of-scope': {
				pattern: /\{/,
				alias: 'punctuation',
			},

			'end-of-scope': {
				pattern: /\}/,
				alias: 'punctuation',
			},

			'punctuation': /[[\]"]/,
		};
	},
};
