(function () {

	if (typeof Prism === 'undefined') {
		return;
	}


	var invisibles = {
		'tab': /\t/,
		'crlf': /\r\n/,
		'lf': /\n/,
		'cr': /\r/,
		'space': / /
	};


	/**
	 * Current language for logging.
	 *
	 * @see handleToken()
	 */
	var lang = null;

	/**
	 * Handles the recursive calling of `addInvisibles` for one token.
	 *
	 * @param {Object|Array} tokens The grammar or array which contains the token.
	 * @param {string|number} name The name or index of the token in `tokens`.
	 */
	function handleToken(tokens, name) {
		var value = tokens[name];

		/*
		 * Do not throw an exception if "value" is not valid.
		 *
		 * dart: token['string'] = undefined
		 * @see https://github.com/PrismJS/prism/blob/59e5a3471377057de1f401ba38337aca27b80e03/components/prism-dart.js#L58
		 *
		 * lisp: tokens['arguments'] = null; "language.arguments" is not present at all
		 * @see https://github.com/PrismJS/prism/blob/59e5a3471377057de1f401ba38337aca27b80e03/components/prism-lisp.js#L36
		 */
		try {
			var type = Prism.util.type(value);
			switch (type) {
				case 'RegExp':
					var inside = {};
					tokens[name] = {
						pattern: value,
						inside: inside
					};
					addInvisibles(inside);
					break;

				case 'Array':
					for (var i = 0, l = value.length; i < l; i++) {
						handleToken(value, i);
					}
					break;

				default: // 'Object'
					// eslint-disable-next-line no-redeclare
					var inside = value.inside || (value.inside = {});
					addInvisibles(inside);
					break;
			}
		} catch (e) {
			if (!value) {
				console.error(`[Show whitespaces] ${lang}: Value for "tokens['${name}']" is ${tokens[name]} https://github.com/PrismJS/prism/issues/3789`);
			} else {
				console.error(`[Show whitespaces] ${lang}: ${e.message}`);
			}
		}
	}

	/**
	 * Recursively adds patterns to match invisible characters to the given grammar (if not added already).
	 *
	 * @param {Object} grammar
	 */
	function addInvisibles(grammar) {
		if (!grammar || grammar['tab']) {
			return;
		}

		// assign invisibles here to "mark" the grammar in case of self references
		for (var name in invisibles) {
			if (invisibles.hasOwnProperty(name)) {
				grammar[name] = invisibles[name];
			}
		}

		// eslint-disable-next-line no-redeclare
		for (var name in grammar) {
			if (grammar.hasOwnProperty(name) && !invisibles[name]) {
				if (name === 'rest') {
					addInvisibles(grammar['rest']);
				} else {
					handleToken(grammar, name);
				}
			}
		}
	}

	Prism.hooks.add('before-highlight', function (env) {
		// Store current lang for logging
		lang = env.language;
		addInvisibles(env.grammar);
	});
}());
