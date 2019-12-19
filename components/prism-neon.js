Prism.languages.neon = {
	'comment': {
		pattern: /#.*/,
		greedy: true
	},
	'datetime': {
		pattern: /(^|[[{(=,\s])\d\d\d\d-\d\d?-\d\d?(?:(?:[Tt]| +)\d\d?:\d\d:\d\d(?:\.\d*)? *(?:Z|[-+]\d\d?(?::?\d\d)?)?)?(?=$|[\]}),\s])/,
		lookbehind: true,
		alias: 'number'
	},
	'key': {
		pattern: /(^|[[{(,\s])[^,:=[\]{}()'"\s]+(?=\s*:(?:$|[\]}),\s])|\s*=)/,
		lookbehind: true,
		alias: 'atrule'
	},
	'number': {
		pattern: /(^|[[{(=,\s])[+-]?(?:0x[\da-fA-F]+|0o[0-7]+|0b[01]+|(?:\d+\.?\d*|\.?\d+)(?:[eE][+-]?\d+)?)(?=$|[\]}),\s])/,
		lookbehind: true
	},
	'boolean': {
		pattern: /(^|[[{(=,\s])(?:true|false|yes|no)(?=$|[\]}),\s])/i,
		lookbehind: true
	},
	'null': {
		pattern: /(^|[[{(=,\s])(?:null)(?=$|[\]}),\s])/i,
		lookbehind: true
	},
	'string': {
		pattern: /(^|[[{(=,\s])(?:'''\r?\n(?:(?:[^\r\n]|\r?\n(?![\t\ ]*'''))*\r?\n)?[\t\ ]*'''|"""\r?\n(?:(?:[^\r\n]|\r?\n(?![\t\ ]*"""))*\r?\n)?[\t\ ]*"""|'[^'\n]*'|"(?:\\.|[^"\n])*")(?=$|[\]}),\s])/m,
		lookbehind: true,
		greedy: true
	},
	'literal': {
		pattern: /(?:[^#"\',:=[\]{}()\x00-\x20`-]|[:-][^"\',\]})\s])(?:[^,:=\]})(\x00-\x20]+|:(?![\s,\]})]|$)|[\ \t]+[^#,:=\]})(\x00-\x20])*/,
		alias: 'string',
	},
	'punctuation': /[,:=[\]{}()-]/,
};

