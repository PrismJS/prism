import type { LanguageProto } from '../types';

export default {
	id: 'bnf',
	alias: 'rbnf',
	grammar: {
		'string': {
			pattern: /"[^\r\n"]*"|'[^\r\n']*'/
		},
		'definition': {
			pattern: /<[^<>\r\n\t]+>(?=\s*::=)/,
			alias: ['rule', 'keyword'],
			inside: {
				'punctuation': /^<|>$/
			}
		},
		'rule': {
			pattern: /<[^<>\r\n\t]+>/,
			inside: {
				'punctuation': /^<|>$/
			}
		},
		'operator': /::=|[|()[\]{}*+?]|\.{3}/
	}
} as LanguageProto<'bnf'>;
