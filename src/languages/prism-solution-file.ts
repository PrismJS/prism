import type { LanguageProto } from '../types';

export default {
	id: 'solution-file',
	alias: 'sln',
	grammar() {
		const guid = {
			// https://en.wikipedia.org/wiki/Universally_unique_identifier#Format
			pattern: /\{[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}\}/i,
			alias: 'constant',
			inside: {
				'punctuation': /[{}]/
			}
		};

		return {
			'comment': {
				pattern: /#.*/,
				greedy: true
			},
			'string': {
				pattern: /"[^"\r\n]*"|'[^'\r\n]*'/,
				greedy: true,
				inside: {
					'guid': guid
				}
			},
			'object': {
				// Foo
				//   Bar("abs") = 9
				//   EndBar
				//   Prop = TRUE
				// EndFoo
				pattern: /^([ \t]*)(?:([A-Z]\w*)\b(?=.*(?:\r\n?|\n)(?:\1[ \t].*(?:\r\n?|\n))*\1End\2(?=[ \t]*$))|End[A-Z]\w*(?=[ \t]*$))/m,
				lookbehind: true,
				greedy: true,
				alias: 'keyword'
			},
			'property': {
				pattern: /^([ \t]*)(?!\s)[^\r\n"#=()]*[^\s"#=()](?=\s*=)/m,
				lookbehind: true,
				inside: {
					'guid': guid
				}
			},
			'guid': guid,
			'number': /\b\d+(?:\.\d+)*\b/,
			'boolean': /\b(?:FALSE|TRUE)\b/,
			'operator': /=/,
			'punctuation': /[(),]/
		};
	}
} as LanguageProto<'solution-file'>;
