Prism.languages.properties = {
	'comment': /^[ \t]*[#!].*$/m,
	'attr-value': {
		pattern: /(^[ \t]*(?:\\(?:\r\n|[^])|[^\\\s:=])+?(?: *[=:] *| ))(?:\\(?:\r\n|[^])|.)+/m,
		lookbehind: true
	},
	'attr-name': /^[ \t]*(?:\\(?:\r\n|[^])|[^\\\s:=])+?(?= *[ =:]| )/m,
	'punctuation': /[=:]/
};