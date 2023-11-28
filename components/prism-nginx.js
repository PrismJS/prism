/**
* @param {import("../prism.js").Prism} Prism
* @param {import("../prism.js").LoaderOptions} [options]
*/
export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['nginx']) {
      return
    }
	var variable = /\$(?:\w[a-z\d]*(?:_[^\x00-\x1F\s"'\\()$]*)?|\{[^}\s"'\\]+\})/i;

	Prism.languages.nginx = {
		'comment': {
			pattern: /(^|[\s{};])#.*/,
			lookbehind: true,
			greedy: true
		},
		'directive': {
			pattern: /(^|\s)\w(?:[^;{}"'\\\s]|\\.|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\s+(?:#.*(?!.)|(?![#\s])))*?(?=\s*[;{])/,
			lookbehind: true,
			greedy: true,
			inside: {
				'string': {
					pattern: /((?:^|[^\\])(?:\\\\)*)(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/,
					lookbehind: true,
					greedy: true,
					inside: {
						'escape': {
							pattern: /\\["'\\nrt]/,
							alias: 'entity'
						},
						'variable': variable
					}
				},
				'comment': {
					pattern: /(\s)#.*/,
					lookbehind: true,
					greedy: true
				},
				'keyword': {
					pattern: /^\S+/,
					greedy: true
				},

				// other patterns

				'boolean': {
					pattern: /(\s)(?:off|on)(?!\S)/,
					lookbehind: true
				},
				'number': {
					pattern: /(\s)\d+[a-z]*(?!\S)/i,
					lookbehind: true
				},
				'variable': variable
			}
		},
		'punctuation': /[{};]/
	};
}