(function(Prism) {
	Prism.languages.llvm = {
		'comment': /;.*/,
		'string': /"[^"]*"/,
		'variable': /[%@!#](?:(?:[-a-zA-Z$._]|\\[a-fA-F0-9]{2})(?:[-a-zA-Z$._0-9]|\\[a-fA-F0-9]{2})*|[0-9]+)/,
		'label': /(?:[-a-zA-Z$._]|\\[a-fA-F0-9]{2})(?:[-a-zA-Z$._0-9]|\\[a-fA-F0-9]{2})*:/,
		'type': /\b(?:void|label|token|metadata|float|double|half)\b/,
		'keyword': /[a-z_][a-z_0-9]*/,
		'number': /[+-]?[0-9]+(?:.[0-9]+)?(?:[eE][+-]?[0-9]+)?|0x[0-9A-Fa-f]+/,
		'punctuation': /[{}[\];(),.!*=<>]/,
	};
}(Prism));
