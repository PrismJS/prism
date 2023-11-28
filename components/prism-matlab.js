/**
* @param {import("../prism.js").Prism} Prism
* @param {import("../prism.js").LoaderOptions} [options]
*/
export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['matlab']) {
      return
    }
	Prism.languages.matlab = {
		'comment': [
			/%\{[\s\S]*?\}%/,
			/%.+/
		],
		'string': {
			pattern: /\B'(?:''|[^'\r\n])*'/,
			greedy: true
		},
		// FIXME We could handle imaginary numbers as a whole
		'number': /(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[eE][+-]?\d+)?(?:[ij])?|\b[ij]\b/,
		'keyword': /\b(?:NaN|break|case|catch|continue|else|elseif|end|for|function|if|inf|otherwise|parfor|pause|pi|return|switch|try|while)\b/,
		'function': /\b(?!\d)\w+(?=\s*\()/,
		'operator': /\.?[*^\/\\']|[+\-:@]|[<>=~]=?|&&?|\|\|?/,
		'punctuation': /\.{3}|[.,;\[\](){}!]/
	};
}