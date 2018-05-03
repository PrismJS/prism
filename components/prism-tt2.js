(function(Prism) {

	Prism.languages.tt2 = Prism.languages.extend('clike', {
		comment: {
			pattern: /#.*/,
			lookbehind: true
		},
		punctuation: /[[\]{},()]/,
		keyword: /\b(?:GET|CALL|SET|DEFAULT|INSERT|INCLUDE|PROCESS|WRAPPER|BLOCK|IF|UNLESS|ELSIF|ELSE|SWITCH|CASE|FOREACH|WHILE|FILTER|USE|MACRO|RAWPERL|PERL|TRY|THROW|CATCH|FINAL|NEXT|LAST|RETURN|STOP|CLEAR|META|TAGS|DEBUG)\b/
	});

	Prism.languages.insertBefore('tt2', 'delimiter', {
		comment: /\[%#[^]*?\%\]/
	});

	Prism.languages.insertBefore('tt2', 'number', {
		variable: /[a-z][_a-z0-9]*(?:\.(?:\d+|\$?[a-z][_a-z0-9]*))*/i
	});

	Prism.languages.insertBefore('tt2', 'keyword', {
		'delimiter': {
			pattern: /^(?:\[%|%%)-?|-?%]$/,
			alias: 'punctuation'			
		}
	});

	Prism.hooks.add('before-tokenize', function(env) {
		var tt2Pattern = /\[%[^]+?%\]/g;
		Prism.languages['markup-templating'].buildPlaceholders(env, 'tt2', tt2Pattern);
	});

	Prism.hooks.add('after-tokenize', function(env) {
		Prism.languages['markup-templating'].tokenizePlaceholders(env, 'tt2');
	});

}(Prism));
