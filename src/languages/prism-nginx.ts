import type { LanguageProto } from '../types';

export default {
	id: 'nginx',
	grammar() {
		const variable = /\$(?:\w[a-z\d]*(?:_[^\x00-\x1F\s"'\\()$]*)?|\{[^}\s"'\\]+\})/i;

		return {
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
} as LanguageProto<'nginx'>;
