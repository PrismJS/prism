Prism.languages.ini= {
	'comment': {
		pattern: /(^[ \f\t\v]*)[#;][^\n\r]*/m,
		lookbehind: true
	},
	'header': {
		pattern: /(^[ \f\t\v]*)\[[^\n\r\]]*\]?/m,
		lookbehind: true,
		inside: {
			'section-name': {
				pattern: /(\[[ \f\t\v]*)[^ \f\n\r\t\v\]]+(?:[ \f\t\v]+[^ \f\n\r\t\v\]]+)*/,
				lookbehind: true,
				alias: 'selector'
			},
			rest: {
				'punctuation': /\[|\]/
			}
		}
	},
	'key': {
		pattern: /(^[ \f\t\v]*)[^ \f\n\r\t\v=]+(?:[ \f\t\v]+[^ \f\n\r\t\v=]+)*(?=[ \f\t\v]*=)/m,
		lookbehind: true,
		alias: 'attr-name'
	},
	'value': {
		pattern: /(=[ \f\t\v]*)[^ \f\n\r\t\v]+(?:[ \f\t\v]+[^ \f\n\r\t\v]+)*/,
		lookbehind: true,
		alias: 'attr-value',
		inside: {
			'inner-value': {
				pattern: /("|').+(?=\1)/,
				lookbehind: true
			}
		}
	},
	'punctuation': /=/
};
