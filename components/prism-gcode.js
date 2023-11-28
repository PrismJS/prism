/**
* @param {import("../prism.js").Prism} Prism
* @param {import("../prism.js").LoaderOptions} [options]
*/
export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['gcode']) {
      return
    }
	Prism.languages.gcode = {
		'comment': /;.*|\B\(.*?\)\B/,
		'string': {
			pattern: /"(?:""|[^"])*"/,
			greedy: true
		},
		'keyword': /\b[GM]\d+(?:\.\d+)?\b/,
		'property': /\b[A-Z]/,
		'checksum': {
			pattern: /(\*)\d+/,
			lookbehind: true,
			alias: 'number'
		},
		// T0:0:0
		'punctuation': /[:*]/
	};
}