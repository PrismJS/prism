import registry from '../registry.js';

/** @type {import('../types.d.ts').LanguageProto<'matlab'>} */
const Self = {
	id: 'matlab',
	grammar: {
		'comment': [/%\{[\s\S]*?\}%/, /%.+/],
		'string': {
			pattern: /\B'(?:''|[^'\r\n])*'/,
			greedy: true,
		},
		// FIXME We could handle imaginary numbers as a whole
		'number': /(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[eE][+-]?\d+)?(?:[ij])?|\b[ij]\b/,
		'keyword':
			/\b(?:NaN|break|case|catch|continue|else|elseif|end|for|function|if|inf|otherwise|parfor|pause|pi|return|switch|try|while)\b/,
		'function': /\b(?!\d)\w+(?=\s*\()/,
		'operator': /\.?[*^\/\\']|[+\-:@]|[<>=~]=?|&&?|\|\|?/,
		'punctuation': /\.{3}|[.,;\[\](){}!]/,
	},
};

export default Self;

registry.add(Self);
