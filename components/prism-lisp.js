(function (Prism) {
	/**
	 * Functions to construct regular expressions
	 * e.g. (interactive ... or (interactive)
	 *
	 * @param {string} name
	 * @returns {RegExp}
	 */
	function simple_form(name) {
		return RegExp(/(\()/.source + '(?:' + name + ')' + /(?=[\s\)])/.source);
	}
	/**
	 * booleans and numbers
	 *
	 * @param {string} pattern
	 * @returns {RegExp}
	 */
	function primitive(pattern) {
		return RegExp(/([\s([])/.source + '(?:' + pattern + ')' + /(?=[\s)])/.source);
	}

	// Patterns in regular expressions

	// Symbol name. See https://www.gnu.org/software/emacs/manual/html_node/elisp/Symbol-Type.html
	// & and : are excluded as they are usually used for special purposes
	var symbol = /(?!\d)[-+*/_~!@$%^=<>{}\w]+/.source;
	// symbol starting with & used in function arguments
	var marker = /&/.source + symbol;
	// Open parenthesis for look-behind
	var par = /(\()/.source;
	var endpar = /(?=\))/.source;
	// End the pattern with look-ahead space
	var space = /(?=\s)/.source;
	var nestedPar = /(?:[^()]|\((?:[^()]|\((?:[^()]|\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\))*\))*\))*/.source;

	var language = {
		// Three or four semicolons are considered a heading.
		// See https://www.gnu.org/software/emacs/manual/html_node/elisp/Comment-Tips.html
		'heading': {
			pattern: /;;;.*/,
			alias: ['comment', 'title']
		},
		'comment': /;.*/,
		'string': {
			pattern: /"(?:[^"\\]|\\.)*"/,
			greedy: true,
			inside: {
				'argument': /[-A-Z]+(?=[.,\s])/,
				'symbol': RegExp('`' + symbol + "'")
			}
		},
		'quoted-symbol': {
			pattern: RegExp(/#?'/.source + symbol),
			alias: ['variable', 'symbol']
		},
		'lisp-property': {
			pattern: RegExp(/:/.source + symbol),
			alias: 'property'
		},
		'splice': {
			pattern: RegExp(/,@?/.source + symbol),
			alias: ['symbol', 'variable']
		},
		'keyword': [
			{
				pattern: RegExp(par + /(?:(?:lexical-)?let\*?|(?:cl-)?letf|if|when|while|unless|cons|cl-loop|and|or|not|cond|setq|error|message|null|require|provide|use-package)/.source + space),
				lookbehind: true
			},
			{
				pattern: RegExp(par + /(?:for|do|collect|return|finally|append|concat|in|by)/.source + space),
				lookbehind: true
			},
		],
		'declare': {
			pattern: simple_form(/declare/.source),
			lookbehind: true,
			alias: 'keyword'
		},
		'interactive': {
			pattern: simple_form(/interactive/.source),
			lookbehind: true,
			alias: 'keyword'
		},
		'boolean': {
			pattern: primitive(/t|nil/.source),
			lookbehind: true
		},
		'number': {
			pattern: primitive(/[-+]?\d+(?:\.\d*)?/.source),
			lookbehind: true
		},
		'defvar': {
			pattern: RegExp(par + /def(?:var|const|custom|group)\s+/.source + symbol),
			lookbehind: true,
			inside: {
				'keyword': /^def[a-z]+/,
				'variable': RegExp(symbol)
			}
		},
		'defun': {
			pattern: RegExp(par + /(?:cl-)?(?:defun\*?|defmacro)\s+/.source + symbol + /\s+\(/.source + nestedPar + /\)/.source),
			lookbehind: true,
			greedy: true,
			inside: {
				'keyword': /^(?:cl-)?def\S+/,
				// See below, this property needs to be defined later so that it can
				// reference the language object.
				'arguments': null,
				'function': {
					pattern: RegExp(/(^\s)/.source + symbol),
					lookbehind: true
				},
				'punctuation': /[()]/
			}
		},
		'lambda': {
			pattern: RegExp(par + 'lambda\\s+\\(\\s*(?:&?' + symbol + '(?:\\s+&?' + symbol + ')*\\s*)?\\)'),
			lookbehind: true,
			greedy: true,
			inside: {
				'keyword': /^lambda/,
				// See below, this property needs to be defined later so that it can
				// reference the language object.
				'arguments': null,
				'punctuation': /[()]/
			}
		},
		'car': {
			pattern: RegExp(par + symbol),
			lookbehind: true
		},
		'punctuation': [
			// open paren, brackets, and close paren
			/(?:['`,]?\(|[)\[\]])/,
			// cons
			{
				pattern: /(\s)\.(?=\s)/,
				lookbehind: true
			},
		]
	};

	var arg = {
		'lisp-marker': RegExp(marker),
		'varform': {
			pattern: RegExp(/\(/.source + symbol + /\s+(?=\S)/.source + nestedPar + /\)/.source),
			inside: language
		},
		'argument': {
			pattern: RegExp(/(^|[\s(])/.source + symbol),
			lookbehind: true,
			alias: 'variable'
		},
		rest: language
	};

	var forms = /\S+(?:\s+\S+)*/.source;

	var arglist = {
		pattern: RegExp(par + nestedPar + endpar),
		lookbehind: true,
		inside: {
			'rest-vars': {
				pattern: RegExp(/&(?:rest|body)\s+/.source + forms),
				inside: arg
			},
			'other-marker-vars': {
				pattern: RegExp(/&(?:optional|aux)\s+/.source + forms),
				inside: arg
			},
			'keys': {
				pattern: RegExp(/&key\s+/.source + forms + /(?:\s+&allow-other-keys)?/.source),
				inside: arg
			},
			'argument': {
				pattern: RegExp(symbol),
				alias: 'variable'
			},
			'punctuation': /[()]/
		}
	};

	language['lambda'].inside.arguments = arglist;
	language['defun'].inside.arguments = Prism.util.clone(arglist);
	language['defun'].inside.arguments.inside.sublist = arglist;

	Prism.languages.lisp = language;
	Prism.languages.elisp = language;
	Prism.languages.emacs = language;
	Prism.languages['emacs-lisp'] = language;
}(Prism));
