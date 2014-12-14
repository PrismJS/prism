(function(Prism) {

	Prism.languages.handlebars = Prism.languages.extend('markup', {});

	var grammar = {
		'handlebars': {
			pattern: /\{\{\{[\w\W]+?\}\}\}|\{\{[\w\W]+?\}\}/g,
			inside: {
				'comment': {
					pattern: /(\{\{)![\w\W]*(?=\}\})/g,
					lookbehind: true
				},
				'delimiter': {
					pattern: /^\{\{\{?|\}\}\}?$/ig,
					alias: 'punctuation'
				},
				'string': /(["'])(\\?.)+?\1/g,
				'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,
				'boolean': /\b(true|false)\b/g,
				'block': {
					pattern: /^(\s*~?\s*)[#\/]\w+/ig,
					lookbehind: true,
					alias: 'keyword'
				},
				'brackets': {
					pattern: /\[[^\]]+\]/,
					inside: {
						punctuation: /\[|\]/g,
						variable: /[\w\W]+/g
					}
				},
				'punctuation': /[!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~]/g,
				'variable': /[^!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~]+/g
			}
		}
	};

	// Tokenize all inline Handlebars expressions that are wrapped in {{ }} or {{{ }}}
	// This allows for easy Handlebars + markup highlighting
	Prism.hooks.add('before-highlight', function(env) {
		if (env.language !== 'handlebars') {
			return;
		}

		env.tokenStack = [];

		env.backupCode = env.code;
		env.code = env.code.replace(/\{\{\{[\w\W]+?\}\}\}|\{\{[\w\W]+?\}\}/ig, function(match) {
			env.tokenStack.push(match);

			return '___HANDLEBARS' + env.tokenStack.length + '___';
		});
	});

	// Restore env.code for other plugins (e.g. line-numbers)
	Prism.hooks.add('before-insert', function(env) {
		if (env.language === 'handlebars') {
			env.code = env.backupCode;
			delete env.backupCode;
		}
	});

	// Re-insert the tokens after highlighting
	// and highlight them with defined grammar
	Prism.hooks.add('after-highlight', function(env) {
		if (env.language !== 'handlebars') {
			return;
		}

		for (var i = 0, t; t = env.tokenStack[i]; i++) {
			env.highlightedCode = env.highlightedCode.replace('___HANDLEBARS' + (i + 1) + '___', Prism.highlight(t, grammar, 'handlebars'));
		}

		env.element.innerHTML = env.highlightedCode;
	});

}(Prism));