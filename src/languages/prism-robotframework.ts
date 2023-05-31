import type { GrammarTokens, LanguageProto } from '../types';

export default {
	id: 'robotframework',
	alias: 'robot',
	grammar() {
		const comment = {
			pattern: /(^[ \t]*| {2}|\t)#.*/m,
			lookbehind: true,
			greedy: true
		};

		const variable = {
			pattern: /((?:^|[^\\])(?:\\{2})*)[$@&%]\{(?:[^{}\r\n]|\{[^{}\r\n]*\})*\}/,
			lookbehind: true,
			inside: {
				'punctuation': /^[$@&%]\{|\}$/
			}
		};

		function createSection(name: string, inside?: GrammarTokens) {
			return {
				pattern: RegExp(/^ ?\*{3}[ \t]*<name>[ \t]*\*{3}(?:.|[\r\n](?!\*{3}))*/.source.replace(/<name>/g, () => name), 'im'),
				alias: 'section',
				inside: {
					'section-header': {
						pattern: /^ ?\*{3}.+?\*{3}/,
						alias: 'keyword'
					},
					...inside,
					'tag': {
						pattern: /([\r\n](?: {2}|\t)[ \t]*)\[[-\w]+\]/,
						lookbehind: true,
						inside: {
							'punctuation': /\[|\]/
						}
					},
					'variable': variable,
					'comment': comment
				}
			};
		}


		const docTag = {
			pattern: /(\[Documentation\](?: {2}|\t)[ \t]*)(?![ \t]|#)(?:.|(?:\r\n?|\n)[ \t]*\.{3})+/,
			lookbehind: true,
			alias: 'string'
		};

		const testNameLike = {
			pattern: /([\r\n] ?)(?!#)(?:\S(?:[ \t]\S)*)+/,
			lookbehind: true,
			alias: 'function',
			inside: {
				'variable': variable
			}
		};

		const testPropertyLike = {
			pattern: /([\r\n](?: {2}|\t)[ \t]*)(?!\[|\.{3}|#)(?:\S(?:[ \t]\S)*)+/,
			lookbehind: true,
			inside: {
				'variable': variable
			}
		};

		return {
			'settings': createSection('Settings', {
				'documentation': {
					pattern: /([\r\n] ?Documentation(?: {2}|\t)[ \t]*)(?![ \t]|#)(?:.|(?:\r\n?|\n)[ \t]*\.{3})+/,
					lookbehind: true,
					alias: 'string'
				},
				'property': {
					pattern: /([\r\n] ?)(?!\.{3}|#)(?:\S(?:[ \t]\S)*)+/,
					lookbehind: true
				}
			}),
			'variables': createSection('Variables'),
			'test-cases': createSection('Test Cases', {
				'test-name': testNameLike,
				'documentation': docTag,
				'property': testPropertyLike
			}),
			'keywords': createSection('Keywords', {
				'keyword-name': testNameLike,
				'documentation': docTag,
				'property': testPropertyLike
			}),
			'tasks': createSection('Tasks', {
				'task-name': testNameLike,
				'documentation': docTag,
				'property': testPropertyLike
			}),
			'comment': comment
		};
	}
} as LanguageProto<'robotframework'>;
