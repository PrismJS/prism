(function (Prism) {

	var erb_pattern = /<%=?[\s\S]+?%>/g;

	Prism.languages.erb = Prism.languages.extend('markup', {
		'erb': {
			pattern: erb_pattern,
			inside: {
				'delimiter': {
					pattern: /^<%=?|%>$/,
					alias: 'punctuation'
				},
				rest: Prism.languages.ruby
			}
		}
	});

	// Tokenize all inline ERB expressions that are wrapped in <%= %>
	// This allows for easy ERB + markup highlighting
	Prism.hooks.add('before-highlight', function(env) {
		if (env.language !== 'erb') {
			return;
		}

		env.tokenStack = [];

		env.backupCode = env.code;
		env.code = env.code.replace(erb_pattern, function(match) {
			var i = env.tokenStack.length;
			// Check for existing strings
			while (env.backupCode.indexOf('___ERB' + i + '___') !== -1)
				++i;

			// Create a sparse array
			env.tokenStack[i] = match;

			return '___ERB' + i + '___';
		});
	});

	// Restore env.code for other plugins (e.g. line-numbers)
	Prism.hooks.add('before-insert', function(env) {
		if (env.language === 'erb') {
			env.code = env.backupCode;
			delete env.backupCode;
		}
	});

	// Re-insert the tokens after highlighting
	// and highlight them with defined grammar
	Prism.hooks.add('after-highlight', function(env) {
		if (env.language !== 'erb') {
			return;
		}

		for (var i = 0, keys = Object.keys(env.tokenStack); i < keys.length; ++i) {
			var k = keys[i];
			var t = env.tokenStack[k];

			// The replace prevents $$, $&, $`, $', $n, $nn from being interpreted as special patterns
			env.highlightedCode = env.highlightedCode.replace('___ERB' + k + '___', Prism.highlight(t, env.grammar, 'erb').replace(/\$/g, '$$$$'));
		}

		env.element.innerHTML = env.highlightedCode;
	});

}(Prism));