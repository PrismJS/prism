/**
* @param {import("../prism.js").Prism} Prism
* @param {import("../prism.js").LoaderOptions} [options]
*/
export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['arff']) {
      return
    }
	Prism.languages.arff = {
		'comment': /%.*/,
		'string': {
			pattern: /(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,
			greedy: true
		},
		'keyword': /@(?:attribute|data|end|relation)\b/i,
		'number': /\b\d+(?:\.\d+)?\b/,
		'punctuation': /[{},]/
	};
}