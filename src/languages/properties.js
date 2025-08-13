/** @type {import('../types.d.ts').LanguageProto<'properties'>} */
export default {
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
