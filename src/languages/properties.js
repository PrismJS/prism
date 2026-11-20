import registry from '../registry.js';

/** @type {import('../types.d.ts').LanguageProto<'properties'>} */
const Self = {
	id: 'properties',
	grammar: {
		'comment': /^[ \t]*[#!].*$/m,
		'value': {
			pattern:
				/(^[ \t]*(?:\\(?:\r\n|[\s\S])|[^\\\s:=])+(?: *[=:] *(?! )| ))(?:\\(?:\r\n|[\s\S])|[^\\\r\n])+/m,
			lookbehind: true,
			alias: 'attr-value',
		},
		'key': {
			pattern: /^[ \t]*(?:\\(?:\r\n|[\s\S])|[^\\\s:=])+(?= *[=:]| )/m,
			alias: 'attr-name',
		},
		'punctuation': /[=:]/,
	},
};

export default Self;

registry.add(Self);
