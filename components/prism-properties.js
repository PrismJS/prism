/**
* @param {import("../prism.js").Prism} Prism
* @param {import("../prism.js").LoaderOptions} [options]
*/
export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['properties']) {
      return
    }
	Prism.languages.properties = {
		'comment': /^[ \t]*[#!].*$/m,
		'value': {
			pattern: /(^[ \t]*(?:\\(?:\r\n|[\s\S])|[^\\\s:=])+(?: *[=:] *(?! )| ))(?:\\(?:\r\n|[\s\S])|[^\\\r\n])+/m,
			lookbehind: true,
			alias: 'attr-value'
		},
		'key': {
			pattern: /^[ \t]*(?:\\(?:\r\n|[\s\S])|[^\\\s:=])+(?= *[=:]| )/m,
			alias: 'attr-name'
		},
		'punctuation': /[=:]/
	};
}