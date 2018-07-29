(function (Prism) {

	var doc = Prism.languages.javadoclike = {
		'parameter': {
			pattern: /(^\s*(?:\/{3}|\*|\/\*\*)\s*@(?:param|arg|arguments)\s+)\w+/m,
			lookbehind: true
		},
		'keyword': {
			// keywords are the first word in a line preceded be an `@` or surrounded by curly braces.
			// @word, {@word}
			pattern: /(^\s*(?:\/{3}|\*|\/\*\*)\s*|\{)@[a-z][a-zA-Z-]+\b/m,
			lookbehind: true
		},
		'punctuation': /[{}]/
	};


	/**
	 * Adds doc comment support to the given language and calls a given callback on each doc comment pattern.
	 *
	 * @param {string} lang the language add doc comment support to.
	 * @param {(pattern: {inside: {rest: undefined}}, index: number, array: {inside: {rest: undefined}}[]) => void} callback the function called with each doc comment pattern as argument.
	 */
	function docCommentSupport(lang, callback) {
		var tokenName = 'doc-comment';

		var grammar = Prism.languages[lang];
		if (!grammar) return;

		var token = grammar[tokenName];

		if (!token) {
			// add doc comment: /** */
			var definition = {};
			definition[tokenName] = {
				pattern: /(^|[^\\])\/\*\*[\s\S]*?(?:\*\/|$)/,
				greedy: true,
				alias: 'comment',
				inside: {}
			};

			Prism.languages.insertBefore(lang, 'comment', definition);
			token = (grammar = Prism.languages[lang])[tokenName];
		}

		if (token instanceof RegExp) // convert to regex to object array
			token = grammar[tokenName] = [{ pattern: token }];

		else if (Prism.util.type(token) !== 'Array') // convert object to array
			token = grammar[tokenName] = [token];

		else // convert regexes to objects
			for (var i = 0; i < token.length; i++)
				if (token[i] instanceof RegExp)
					token[i] = { pattern: token[i] };

		// call function on each object
		for (var i = 0; i < token.length; i++) {
			callback(token[i], i, token);
		}
	}

	var basicSupport = ['java', 'javascript', 'php'];
	for (var i = 0; i < basicSupport.length; i++) {
		docCommentSupport(basicSupport[i], function (pattern, index, array) {
			pattern.inside.rest = doc;
		});
	}

}(Prism));
