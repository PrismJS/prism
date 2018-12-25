(function (Prism) {

	var build = Prism.patterns.build;

	var simpleString = /'[^'\n\r]*'|"(?:\\.|[^\\"\r\n])*"/;

	var simpleKey = build(/[\w-]+|<<0>>/, [simpleString]);
	var key = build(/<<0>>(?:\s*\.\s*<<0>>)*/, [simpleKey])

	Prism.languages.toml = {
		'comment': {
			pattern: /#.*/,
			greedy: true
		},
		'table': {
			pattern: build(/(\[\s*)<<0>>(?=\s*\])/, [key]),
			lookbehind: true,
			greedy: true,
			alias: 'class-name'
		},
		'key': {
			pattern: build(/(^\s*|[{,]\s*)<<0>>(?=\s*=)/m, [key]),
			lookbehind: true,
			greedy: true,
			alias: 'property'
		},
		'string': {
			pattern: build(/"""(?:\\[\s\S]|[^\\])*?"""|'''[\s\S]*?'''|<<0>>/, [simpleString]),
			greedy: true
		},
		'date': [
			{
				// Offset Date-Time, Local Date-Time, Local Date
				pattern: /\d{4}-\d{2}-\d{2}(?:[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?/i,
				alias: 'number'
			},
			{
				// Local Time
				pattern: /\d{2}:\d{2}:\d{2}(?:\.\d+)?/i,
				alias: 'number'
			}
		],
		'number': /(?:\b0(?:x[\da-zA-Z]+(?:_[\da-zA-Z]+)*|o[0-7]+(?:_[0-7]+)*|b[10]+(?:_[10]+)*))\b|[-+]?\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?\b|[-+]?(?:inf|nan)\b/,
		'boolean': /\b(?:true|false)\b/,
		'punctuation': /[.,=[\]{}]/
	};
}(Prism));
