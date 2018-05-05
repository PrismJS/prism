(function(Prism) {

	Prism.languages.tt2 = Prism.languages.extend('clike', {
		comment: {
			pattern: /#.*|\[%#[\s\S]*?%\]/,
			lookbehind: true
		},
		keyword: /\b(?:GET|CALL|SET|DEFAULT|INSERT|INCLUDE|PROCESS|WRAPPER|BLOCK|IF|UNLESS|ELSIF|ELSE|SWITCH|CASE|FOREACH|IN|WHILE|FILTER|USE|MACRO|RAWPERL|PERL|TRY|THROW|CATCH|FINAL|NEXT|LAST|RETURN|STOP|CLEAR|META|TAGS|DEBUG|END)\b/,
		punctuation: /[[\]{},()]/
	});

	var operatorRE = /(?:=>|==|!=|<=|<|>=|>|=|&&|\|\||\||!|and|or|not)/;

	Prism.languages.insertBefore('tt2', 'number', {
		operator: operatorRE,
		variable: {
			pattern: /[a-z]\w*(?:[\011-\015\040]*\.[\011-\015\040]*(?:\d+|\$?[a-z]\w*))*/i,
			greedy: true
		}
	});

	// FIXME! Is this repetition really necessary?
	Prism.languages.insertBefore('tt2', 'variable', {
		operator: operatorRE
	});

	Prism.languages.insertBefore('tt2', 'keyword', {
		'delimiter': {
			pattern: /^(?:\[%|%%)-?|-?%]$/,
			alias: 'punctuation'
		}
	});

	Prism.languages.insertBefore('tt2', 'string', {
		'single-quoted-string': {
			pattern: /'[^\\']*(?:\\.[^\\']*)*'/,
			greedy: true,
			alias: 'string'
		},
		'double-quoted-string': {
			pattern: /"[^\\"]*(?:\\.[^\\"]*)*"/,
			greedy: true,
			alias: 'string',
			inside: {
				variable: {
					pattern: /\$(?:[a-z][_a-z0-9]*(?:\.(?:\d+|\$?[a-z][_a-z0-9]*))*)/i,
					greedy: true
				}
			}
		}
	});

    // The different types of TT2 strings "replace" the C-like standard string
	delete Prism.languages.tt2.string;

	Prism.hooks.add('before-tokenize', function(env) {
		var tt2Pattern = /\[%[\s\S]+?%\]/g;
		Prism.languages['markup-templating'].buildPlaceholders(env, 'tt2', tt2Pattern);
	});

	Prism.hooks.add('after-tokenize', function(env) {
		Prism.languages['markup-templating'].tokenizePlaceholders(env, 'tt2');
	});

}(Prism));
