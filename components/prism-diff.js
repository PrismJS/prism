(function (Prism) {

	Prism.languages.diff = {
		'coord': [
			// Match all kinds of coord lines (prefixed by "+++", "---" or "***").
			/^(?:\*{3}|-{3}|\+{3}).*$/m,
			// Match "@@ ... @@" coord lines in unified diff.
			/^@@.*@@$/m,
			// Match coord lines in normal diff (starts with a number).
			/^\d+.*$/m
		]

		// deleted, inserted, unchanged, diff
	};

	/**
	 * A map from the name of a block to its line prefix.
	 *
	 * @type {Object<string, string>}
	 */
	var prefixes = {
		'deleted-sign': '-',
		'deleted-arrow': '<',
		'inserted-sign': '+',
		'inserted-arrow': '>',
		'unchanged': ' ',
		'diff': '!',
	};

	// add a token for each prefix
	Object.keys(prefixes).forEach(function (name) {
		var prefix = prefixes[name];

		var alias = [];
		if (!/^\w+$/.test(name)) { // "deleted-sign" -> "deleted"
			alias.push(/\w+/.exec(name)[0]);
		}
		if (name === "diff") {
			alias.push("bold");
		}

		Prism.languages.diff[name] = {
			// pattern: /^(?:[_].*(?:\r\n?|\n|(?![\s\S])))+/m
			pattern: RegExp('^(?:[' + prefix + '].*(?:\r\n?|\n|(?![\\s\\S])))+', 'm'),
			alias: alias
		};
	});


	var LANGUAGE_REGEX = /diff-([\w-]+)/i;
	var HTML_TAG = /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/gi;
	//this will match a line plus the line break while ignoring the line breaks HTML tags may contain.
	var HTML_LINE = RegExp(/(?:__|[^\r\n<])*(?:\r\n?|\n|(?:__|[^\r\n<])(?![^\r\n]))/.source.replace(/__/g, HTML_TAG.source), 'gi');

	Prism.hooks.add('before-sanity-check', function (env) {
		var lang = env.language;
		if (LANGUAGE_REGEX.test(lang) && !env.grammar) {
			env.grammar = Prism.languages[lang] = Prism.languages.diff;
		}
	})
	Prism.hooks.add('before-tokenize', function (env) {
		var lang = env.language;
		if (LANGUAGE_REGEX.test(lang) && !Prism.languages[lang]) {
			Prism.languages[lang] = Prism.languages.diff;
		}
	})

	Prism.hooks.add('wrap', function (env) {
		var diffLanguage, diffGrammar;

		if (env.language !== 'diff') {
			var langMatch = LANGUAGE_REGEX.exec(env.language);
			if (!langMatch) {
				return; // not a language specific diff
			}

			diffLanguage = langMatch[1];
			diffGrammar = Prism.languages[diffLanguage];
		}

		// one of the diff tokens without any nested tokens
		if (env.type in prefixes) {
			/** @type {string} */
			var content = env.content.replace(HTML_TAG, ''); // remove all HTML tags

			/** @type {string} */
			var decoded = content.replace(/&amp;/g, '&').replace(/&lt;/g, '<');

			// remove any one-character prefix
			var code = decoded.replace(/(^|[\r\n])./g, '$1');

			// highlight, if possible
			var highlighted;
			if (diffGrammar) {
				highlighted = Prism.highlight(code, diffGrammar, diffLanguage);
			} else {
				highlighted = Prism.util.encode(code);
			}

			// get the HTML source of the prefix token
			var prefixToken = new Prism.Token('prefix', prefixes[env.type], [/\w+/.exec(env.type)[0]]);
			var prefix = Prism.Token.stringify(prefixToken, env.language);

			// add prefix
			var lines = [], m;
			HTML_LINE.lastIndex = 0;
			while (m = HTML_LINE.exec(highlighted)) {
				lines.push(prefix + m[0]);
			}
			if (/(?:^|[\r\n]).$/.test(decoded)) {
				// because both "+a\n+" and "+a\n" will map to "a\n" after the line prefixes are removed
				lines.push(prefix);
			}
			env.content = lines.join('');

			if (diffGrammar) {
				env.classes.push('language-' + diffLanguage);
			}
		}
	});

}(Prism));
