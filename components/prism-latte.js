/* TODO
	Add support for the n:syntax attribute macro
	Add support for string interpolation using {$advancedSyntax} within macros
*/

(function(Prism) {

	var string_interpolation = {
		pattern: /{\$(?:{(?:{[^{}]+}|[^{}]+)}|[^{}])+}|(^|[^\\{])\$+(?:\w+(?:\[.+?]|->\w+)*)/,
		lookbehind: true,
		inside: {
			rest: Prism.languages.php
		}
	};

	var inside = {
		'string': [
			{
				pattern: /'(?:\\[\s\S]|[^\\'])*'/,
				greedy: true
			},
			{
				pattern: /"(?:\\[\s\S]|[^\\"])*"/,
				greedy: true,
				inside: {
					'interpolation': string_interpolation
				}
			}
		],
		'number': /\b0x[\dA-Fa-f]+|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][-+]?\d+)?/,
		'variable': [
			/\$(?!\d)\w+/,
			{
				pattern: /(->)(?!\d)\w+/,
				lookbehind: true
			},
			{
				pattern: /(\[)(?!\d)\w+(?=\])/,
				lookbehind: true
			}
		],
		'filter': {
			pattern: /((?:^|[^|])\|\s*)(?!\d)\w+/,
			lookbehind: true,
			alias: 'function'
		},
		'function': /\b(?!\d)\w+(?=\s*\()/,
		'keyword': [
			{
				pattern: /\b(?:true|false)\b/,
				alias: 'boolean'
			},
			{
				pattern: /\b(?:null|as)\b/,
			},
			{
				pattern: /\b(?:or|and)\b/,
				alias: 'operator'
			}
		],
		'word': {
			pattern: /:?[a-zA-Z0-9_.-]+(?::[a-zA-Z0-9_.-]+)*[:!]?(?=[\s,\])]|$)/,
			alias: 'string'
		},
		'operator': /[+\-*\/%]|==?=?|[!<>]=?|&&|\|\|?/,
		'punctuation': /[\[\]().,:`]+|->|=>/
	};

	function mkmacro(begin, content, closing) {
		var pattern = new RegExp('^\\{\\{?' + (closing ? '\\/?' : '') + (begin ? begin.source : '(?!\\s)'));

		var macro = {
			'macro-open': {
				pattern: pattern,
				inside: {
					'punctuation': /^\{\{?\/?/
				}
			},
			'macro-close': {
				pattern: /\}?\}$/,
				inside: {
					'punctuation': /.+/
				}
			},
			rest: content
		};

		if (begin) {
			macro['macro-open'].inside.keyword = begin;
		}

		return macro;
	}

	Prism.languages.latte = {
		'comment': {
			pattern: /\{\{\*[\s\S]*?\*\}\}|\{\*[\s\S]*?\*\}/,
			greedy: true
		},
		'macro-php': {
			pattern: /\{\{php[\s\S]*?\}\}|\{php[\s\S]*?\}/,
			greedy: true,
			inside: mkmacro(/php/, Prism.languages.php)
		},
		'macro': {
			pattern: /\{\{\/?(?:[!_]|[a-zA-Z][a-zA-Z0-9_.]+(?=\s|\}))[\s\S]*?\}\}|\{\/?(?:[!_]|[a-zA-Z][a-zA-Z0-9_.]+(?=\s|\}))[\s\S]*?\}/,
			greedy: true,
			inside: mkmacro(/[a-zA-Z0-9_.!]+/, inside, true)
		},
		'expression': {
			pattern: /\{\{(?!\s)[\s\S]*?\}\}|\{(?!\s)[\s\S]*?\}/,
			greedy: true,
			inside: mkmacro(null, inside)
		}
	};

	if (Prism.languages.markup) {
		Prism.languages.insertBefore('inside', 'attr-value', {
			'latte-n-macro': {
				pattern: /\s*n:[a-zA-Z][a-zA-Z0-9._-]*(?:=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1)?/,
				alias: 'language-latte',
				inside: {
					'macro-name': {
						pattern: /\s*n:[a-zA-Z][a-zA-Z0-9._-]*/,
						alias: 'attr-name function'
					},
					'punctuation': /^\s*=\s*['"]|['"]\s*$/,
					'attr-value': {
						pattern: /.+/i,
						inside: inside
					}
				}
			}
		}, Prism.languages.markup.tag);
	}

	// Tokenize all inline Latte expressions
	Prism.hooks.add('before-tokenize', function(env) {
		if (!/(?:\{[a-zA-Z$_!])/ig.test(env.code)) {
			return;
		}

		var pattern = /\{\{\*[\s\S]*?\*\}\}|\{\{(?!\s)[\s\S]+?\}\}|\{\*[\s\S]*?\*\}|\{(?!\s)[\s\S]+?\}/g;
		var syntaxPattern = /^\{\{?syntax\s+(latte|double|off)\}?\}$/;
		var syntaxModes = {
			'off': 0,
			'latte': 1,
			'double': 2
		};
		var syntaxMode = 1;

		Prism.languages['markup-templating'].buildPlaceholders(env, 'latte', pattern, function (match) {
			if (syntaxMode < 1) {
				return false;
			}

			var valid, m;

			switch (syntaxMode) {
				case 0: return false;
				case 1: valid = match.charAt(1) !== '{'; break;
				case 2: valid = match.charAt(1) === '{'; break;
			}

			if (m = valid ? syntaxPattern.exec(match) : null) {
				syntaxMode = syntaxModes[m[1]];
			}

			return valid;
		});
	});

	// Re-insert the tokens after tokenizing
	Prism.hooks.add('after-tokenize', function(env) {
		Prism.languages['markup-templating'].tokenizePlaceholders(env, 'latte');
	});

}(Prism));