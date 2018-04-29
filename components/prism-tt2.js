(function(Prism) {

	var tt2_pattern = /\[%[\s\S]+?%\]|^%%*?/;

	Prism.languages.tt2 = Prism.languages.extend('markup', {
		'tt2': {
			pattern: tt2_pattern,
			inside: {
				'comment': {
					pattern: /(^|[^\\$])#.*/,
					lookbehind: true
				},
				'delimiter': {
					pattern: /^(?:\[%|%%)-?|-?%]$/i,
					alias: 'punctuation'
				},
				'string': /(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,
				'number': /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
				'keyword': /\b(?:GET|CALL|SET|DEFAULT|INSERT|INCLUDE|PROCESS|WRAPPER|BLOCK|IF|UNLESS|ELSIF|ELSE|SWITCH|CASE|FOREACH|WHILE|FILTER|USE|MACRO|RAWPERL|PERL|TRY|THROW|CATCH|FINAL|NEXT|LAST|RETURN|STOP|CLEAR|META|TAGS|DEBUG)\b/,
				'operator': /\b(?:=>|==|!=|<|<=|>|>=|&&\|\|!|and|or|not)\b/,
				'punctuation': /[[\]{},]/,
				'variable': /[a-zA-Z][\.\/\$a-zA-Z0-9]*/
			}
		}
	});

	// Tokenize all inline TT2 expressions that are wrapped in [% %]
	// This allows for easy TT2 + markup highlighting
	Prism.hooks.add('before-highlight', function(env) {
		if (env.language !== 'tt2') {
			return;
		}

		env.tokenStack = [];

		env.backupCode = env.code;
		env.code = env.code.replace(tt2_pattern, function(match) {
			var i = env.tokenStack.length;
			// Check for existing strings
			while (env.backupCode.indexOf('___TT2' + i + '___') !== -1)
				++i;

			// Create a sparse array
			env.tokenStack[i] = match;

			return '___TT2' + i + '___';
		});
	});

	// Restore env.code for other plugins (e.g. line-numbers)
	Prism.hooks.add('before-insert', function(env) {
		if (env.language === 'tt2') {
			env.code = env.backupCode;
			delete env.backupCode;
		}
	});

	// Re-insert the tokens after highlighting
	// and highlight them with defined grammar
	Prism.hooks.add('after-highlight', function(env) {
		if (env.language !== 'tt2') {
			return;
		}

		for (var i = 0, keys = Object.keys(env.tokenStack); i < keys.length; ++i) {
			var k = keys[i];
			var t = env.tokenStack[k];

			// The replace prevents $$, $&, $`, $', $n, $nn from being interpreted as special patterns
			env.highlightedCode = env.highlightedCode.replace('___TT2' + k + '___', Prism.highlight(t, env.grammar, 'tt2').replace(/\$/g, '$$$$'));
		}

		env.element.innerHTML = env.highlightedCode;
	});

}(Prism));

Prism.languages.tt = Prism.languages.tt2;
