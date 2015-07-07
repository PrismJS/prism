Prism.languages.prolog = {
	// Syntax depends on the implementation
	'comment': [
		/%.+/,
		/\/\*[\s\S]*?\*\//
	],
	// Depending on the implementation, strings may allow escaped newlines and quote-escape
	'string': /(["'])(?:\1\1|\\[\s\S]|(?!\1).)*\1/,
	'builtin': /\b(?:fx|fy|xf[xy]?|yfx?)\b/,
	'variable': /\b[A-Z_]\w*/,
	// FIXME: Should we list all null-ary predicates (not followed by a parenthesis) like halt, trace, etc.?
	'function': /\b[a-z]\w*(?:(?=\()|\/\d+)/,
	'number': /\b\d+\.?\d*/,
	'operator': /[:\\=><\-?*@\/;+^|!$.]+|\b(?:is|mod|not|xor)\b/,
	'punctuation': /[(){}\[\],]/
};