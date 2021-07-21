var module = {
	pattern: /\b\w+(?:\.\w+)*/,
	alias: 'class-name',
	inside: {
		'punctuation': /\./
	}
}

Prism.languages.dial = {
	'comment': {
		pattern: /(^|[^\\])#.*/,
		lookbehind: true
	},
	'call': {
		pattern: /\b\w+(?:\.\w+)*\s*->\s*\w+(?:\.\w+)*\b/,
		inside: {
			'module': module,
			'operator': /->/,
		}
	},
	'note': {
		pattern: /@\w[\.\w\s~]*:\s*(?:\|)?[^\r\n]*/,
		alias: 'string',
		inside: {
			'module': module,
			'punctuation': /:|~/
		}
	},
	'keyword': /\b(?:if|else|elif|for|while|in|version|author|diagram|sequence)\b/,
	'operator': /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
	'number': /(?:\b(?=\d)|\B(?=\.))(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?j?\b/i,
	'punctuation': /[{}[\];(),.:]/
};
