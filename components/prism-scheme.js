Prism.languages.scheme = {
	'comment': /;.*/,
	'string': {
		pattern: /"(?:[^"\\]|\\.)*"/,
		greedy: true
	},
	'symbol': {
		pattern: /'[^()#'\s]+/,
		greedy: true
	},
	'character': {
		pattern: /#\\(?:[ux][a-fA-F\d]+|[-a-zA-Z]+|\S)/,
		greedy: true,
		alias: 'string'
	},
	'lambda-parameter': {
		pattern: /(\(lambda\s+\()[^()'\s]+/,
		lookbehind: true
	},
	'keyword': {
		pattern: /(\()(?:define(?:-syntax|-library|-values)?|(?:case-)?lambda|let(?:\*|rec)?(?:-values)?|else|if|cond|begin|delay(?:-force)?|parameterize|guard|set!|(?:quasi-)?quote|syntax-rules)(?=[()\s])/,
		lookbehind: true
	},
	'builtin': {
		pattern: /(\()(?:(?:cons|car|cdr|list|call-with-current-continuation|call\/cc|append|abs|apply|eval)\b|null\?|pair\?|boolean\?|eof-object\?|char\?|procedure\?|number\?|port\?|string\?|vector\?|symbol\?|bytevector\?)(?=[()\s])/,
		lookbehind: true
	},
	'number': {
		// This pattern (apart from the lookarounds) works like this:
		// <floating point> := \d*\.?\d+(?:[eE][+-]?\d+)?
		// <complex>        := <floating point>(?:[+-]<floating point>i)?|<floating point>i
		// <fraction>       := \d+\/\d+
		// <number>         := [+-]?(?:<fraction>|<complex>)
		pattern: /([\s()])[-+]?(?:\d+\/\d+|\d*\.?\d+(?:[eE][+-]?\d+)?(?:[+-]\d*\.?\d+(?:[eE][+-]?\d+)?i)?|\d*\.?\d+(?:[eE][+-]?\d+)?i)(?=[\s()]|$)/,
		lookbehind: true
	},
	'boolean': /#[tf]/,
	'operator': {
		pattern: /(\()(?:[-+*%\/]|[<>]=?|=>?)(?=\s|$)/,
		lookbehind: true
	},
	'function': {
		pattern: /(\()[^()'\s]+(?=[()\s]|$)/,
		lookbehind: true
	},
	'punctuation': /[()']/
};
