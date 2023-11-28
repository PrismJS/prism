/**
* @param {import("../prism.js").Prism} Prism
* @param {import("../prism.js").LoaderOptions} [options]
*/
export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['roboconf']) {
      return
    }
	Prism.languages.roboconf = {
		'comment': /#.*/,
		'keyword': {
			'pattern': /(^|\s)(?:(?:external|import)\b|(?:facet|instance of)(?=[ \t]+[\w-]+[ \t]*\{))/,
			lookbehind: true
		},
		'component': {
			pattern: /[\w-]+(?=[ \t]*\{)/,
			alias: 'variable'
		},
		'property': /[\w.-]+(?=[ \t]*:)/,
		'value': {
			pattern: /(=[ \t]*(?![ \t]))[^,;]+/,
			lookbehind: true,
			alias: 'attr-value'
		},
		'optional': {
			pattern: /\(optional\)/,
			alias: 'builtin'
		},
		'wildcard': {
			pattern: /(\.)\*/,
			lookbehind: true,
			alias: 'operator'
		},
		'punctuation': /[{},.;:=]/
	};
}