(function (Prism) {

	var javaDocLike = Prism.languages.javadoclike = {
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
	 * @param {(pattern: {inside: {rest: undefined}}) => void} callback the function called with each doc comment pattern as argument.
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
				alias: 'comment',
				inside: {}
			};

			grammar = Prism.languages.insertBefore(lang, 'comment', definition);
			token = grammar[tokenName];

		} else if (token instanceof RegExp) { // convert existing regex to object
			token = grammar[tokenName] = { pattern: token };
		}

		if (Prism.util.type(token) === 'Array') {
			for (var i = 0, l = token.length; i < l; i++) {
				if (token[i] instanceof RegExp)
					token[i] = { pattern: token[i] };
				callback(token[i]);
			}
		} else {
			callback(token);
		}
	}

	Object.defineProperty(javaDocLike, 'addSupport', {

		/**
		 * Adds doc-comment support to the given languages for the given documentation language.
		 */
		value: function addSupport(languages, docLanguage) {
			languages.forEach(function (lang) {
				docCommentSupport(lang, function (pattern) {
					if (!pattern.inside)
						pattern.inside = {};
					pattern.inside.rest = docLanguage;
				});
			});
		}

	});

	javaDocLike.addSupport(['java', 'javascript', 'php'], javaDocLike);

}(Prism));
