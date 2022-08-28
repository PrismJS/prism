export default /** @type {import("../types").LanguageProto<'gcode'>} */ ({
	id: 'gcode',
	grammar: {
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
	}
});
