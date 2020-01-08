(function (Prism) {

	var javascript = Prism.languages.javascript;
	var jsExpression = javascript.$.expression;

	console.log("dasf");


	Prism.languages.qml = {
		'comment': {
			pattern: /\/\/.*|\/\*[\s\S]*?\*\//,
			greedy: true
		},
		'javascript-function': {
			pattern: RegExp(/((?:^|;)[ \t]*)function\s+[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*\(<js>*\)\s*\{<js>*\}/.source.replace(/<js>/g, jsExpression), 'm'),
			lookbehind: true,
			greedy: true,
			alias: 'language-javascript',
			inside: javascript
		},
		'class-name': {
			pattern: /((?:^|[:;])[ \t]*)(?!\d)\w+(?=[ \t]*\{|[ \t]+on\b)/m,
			lookbehind: true
		},
		'property': [
			{
				pattern: /((?:^|[;{])[ \t]*)(?!\d)\w+(?:\.\w+)*(?=[ \t]*:)/m,
				lookbehind: true
			},
			{
				pattern: /((?:^|[;{])[ \t]*)property[ \t]+(?!\d)\w+(?:\.\w+)*[ \t]+(?!\d)\w+(?:\.\w+)*(?=[ \t]*:)/m,
				lookbehind: true,
				inside: {
					'keyword': /^property/,
					'property': /\w+(?:\.\w+)*/
				}
			}
		],
		'javascript-expression': {
			pattern: RegExp(/(:[ \t]*)(?![\s;}[])(?:(?!$|[;}])<js>)+/.source.replace(/<js>/g, jsExpression), 'm'),
			lookbehind: true,
			greedy: true,
			alias: 'language-javascript',
			inside: javascript
		},
		'string': /"(?:\\.|[^\\"\r\n])*"/,
		'keyword': /\b(?:as|import|on)\b/,
		'punctuation': /[{}[\]:;,]/
	};

}(Prism));
