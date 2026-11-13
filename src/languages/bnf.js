import registry from '../registry.js';

/** @type {import('../types.d.ts').LanguageProto<'bnf'>} */
const Self = {
	id: 'bnf',
	alias: 'rbnf',
	grammar: {
		'string': {
			pattern: /"[^\r\n"]*"|'[^\r\n']*'/,
		},
		'definition': {
			pattern: /<[^<>\r\n\t]+>(?=\s*::=)/,
			alias: ['rule', 'keyword'],
			inside: {
				'punctuation': /^<|>$/,
			},
		},
		'rule': {
			pattern: /<[^<>\r\n\t]+>/,
			inside: {
				'punctuation': /^<|>$/,
			},
		},
		'operator': /::=|[|()[\]{}*+?]|\.{3}/,
	},
};

export default Self;

registry.add(Self);
