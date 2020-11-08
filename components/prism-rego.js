Prism.languages.rego = {
	'comment': /[#].*$/m,
	'keyword': /\b(?:input|default)\b/,
	'string': /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
	'boolean': /\b(?:true|false|allow|deny)\b/,
	'operator': /&&?|\|\|?|\*\*?|>>>?|<<|[:=<>!~]=?|[-/%^]|\+!?|\b(?:not)\b/,
	'function': [
		{
			pattern: /\b(?:package|some)\b/
		},
		{
			pattern: /\b(?:round|abs|count|sum|product|max|min|sort|all|any)\b/,
			inside: {
				builtin: /([^(])/,
			}
		},
	],
	'constant': /[^\[]+(?=\])/m,
	
};
