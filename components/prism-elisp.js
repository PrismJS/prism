Prism.languages.elisp = (function() {
	// Patterns in regular expressions

	// Symbol name. See https://www.gnu.org/software/emacs/manual/html_node/elisp/Symbol-Type.html
	// & and : are excluded as they are usually used for special purposes
	const symbol = '[-+*/_~!@$%^=<>{}\\w]+'
	// symbol starting with & used in function arguments
	const marker = '&' + symbol
	// Open parenthesis for look-behind
	const par = '(\\()'
	const endpar = '(?=\\))'
	// End the pattern with look-ahead space
	const space = '(?=\\s)'

	// Functions to construct regular expressions
	// simple form
	// e.g. (interactive ... or (interactive)
	const simple_form = name => new RegExp(`(\\()${name}(?=[\\s\\)])`)
	// booleans and numbers
	const primitive = pattern => new RegExp(`([\\s\\(\\[])${pattern}(?=[\\s\\)])`)

	var language = {
		// Three or four semicolons are considered a heading.
		// See https://www.gnu.org/software/emacs/manual/html_node/elisp/Comment-Tips.html
		heading: {
			pattern: /;;;.*/,
			alias: ['comment', 'title'],
		},
		comment: /;.*/,
		string: {
			pattern: /"(?:[^"\\]*|\\.)*"/,
			greedy: true,
			inside: {
				argument: /[-A-Z]+(?=[.,\s])/,
				symbol: new RegExp('`' + symbol + "'"),
			},
		},
		'quoted-symbol': {
			pattern: new RegExp("#?'" + symbol),
			alias: ['variable', 'symbol'],
		},
		'lisp-property': {
			pattern: new RegExp(':' + symbol),
			alias: 'property',
		},
		splice: {
			pattern: new RegExp(',@?' + symbol),
			alias: ['symbol', 'variable'],
		},
		keyword: [
			{
				pattern: new RegExp(
					par +
						'(?:(?:lexical-)?let\\*?|(?:cl-)?letf|if|when|while|unless|cons|cl-loop|and|or|not|cond|setq|error|message|null|require|provide|use-package)' +
						space
				),
				lookbehind: true,
			},
			{
				pattern: new RegExp(
					par + '(?:for|do|collect|return|finally|append|concat|in|by)' + space
				),
				lookbehind: true,
			},
		],
		declare: {
			pattern: simple_form('declare'),
			lookbehind: true,
			alias: 'keyword',
		},
		interactive: {
			pattern: simple_form('interactive'),
			lookbehind: true,
			alias: 'keyword',
		},
		boolean: {
			pattern: primitive('(?:t|nil)'),
			lookbehind: true,
		},
		number: [
			{
				pattern: primitive('[-+]?\\d+(?:\\.\\d*)?'),
				lookbehind: true,
			},
		],
		defvar: {
			pattern: new RegExp(par + 'def(?:var|const|custom|group)\\s+' + symbol),
			lookbehind: true,
			inside: {
				keyword: /def[a-z]+/,
				variable: new RegExp(symbol),
			},
		},
		defun: {
			pattern: new RegExp(
				par + `(?:cl-)?(?:defun\\*?|defmacro)\\s+${symbol}\\s+\\([\\s\\S]*\\)`
			),
			lookbehind: true,
			inside: {
				keyword: /(?:cl-)?def\S+/,
				arguments: null,
				function: {
					pattern: new RegExp('(^\\s)' + symbol),
					lookbehind: true,
				},
				punctuation: /[()]/,
			},
		},
		lambda: {
			pattern: new RegExp(par + `lambda\\s+\\((?:&?${symbol}\\s*)*\\)`),
			lookbehind: true,
			inside: {
				keyword: /lambda/,
				arguments: null,
				punctuation: /[()]/,
			},
		},
		car: {
			pattern: new RegExp(par + symbol),
			lookbehind: true,
		},
		punctuation: [
			// open paren
			/['`,]?\(/,
			// brackets and close paren
			/[)\[\]]/,
			// cons
			{
				pattern: /(\s)\.(?=\s)/,
				lookbehind: true,
			},
		],
	}

	const arg = {
		'lisp-marker': new RegExp(marker),
		rest: {
			argument: {
				pattern: new RegExp(symbol),
				alias: 'variable',
			},
			varform: {
				pattern: new RegExp(par + symbol + '\\s+\\S[\\s\\S]*' + endpar),
				lookbehind: true,
				inside: {
					string: language.string,
					boolean: language.boolean,
					number: language.number,
					symbol: language.symbol,
					punctuation: /[()]/,
				},
			},
		},
	}

	const forms = '\\S+(?:\\s+\\S+)*'

	const arglist = {
		pattern: new RegExp(par + '[\\s\\S]*' + endpar),
		lookbehind: true,
		inside: {
			'rest-vars': {
				pattern: new RegExp('&(?:rest|body)\\s+' + forms),
				inside: arg,
			},
			'other-marker-vars': {
				pattern: new RegExp('&(?:optional|aux)\\s+' + forms),
				inside: arg,
			},
			keys: {
				pattern: new RegExp('&key\\s+' + forms + '(?:\\s+&allow-other-keys)?'),
				inside: arg,
			},
			argument: {
				pattern: new RegExp(symbol),
				alias: 'variable',
			},
			punctuation: /[()]/,
		},
	}

	language['lambda'].inside.arguments = arglist
	language['defun'].inside.arguments = Prism.util.clone(arglist)
	language['defun'].inside.arguments.inside.sublist = arglist

	return language
})()
