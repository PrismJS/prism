(function(Prism) {

	Prism.languages.tt2 = Prism.languages.extend('clike', {
		comment: {
			pattern: /#.*|\[%#[\s\S]*?%\]/,
			lookbehind: true
		},
		keyword: /\b(?:BLOCK|CALL|CASE|CATCH|CLEAR|DEBUG|DEFAULT|ELSE|ELSIF|END|FILTER|FINAL|FOREACH|GET|IF|IN|INCLUDE|INSERT|LAST|MACRO|META|NEXT|PERL|PROCESS|RAWPERL|RETURN|SET|STOP|TAGS|THROW|TRY|SWITCH|UNLESS|USE|WHILE|WRAPPER)\b/,
		punctuation: /[[\]{},()]/
	});

	delete Prism.languages.tt2['operator'];
	Prism.languages.insertBefore('tt2', 'number', {
		operator: /(?:=>|==|!=|<=|<|>=|>|=|&&|\|\||\||!|and|or|not)/,
		variable: {
			pattern: /[a-z]\w*(?:[\011-\015\040]*\.[\011-\015\040]*(?:\d+|\$?[a-z]\w*))*/i,
			greedy: true
		}
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
