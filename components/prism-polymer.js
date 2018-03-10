/* TODO
	Add support for conditional attributes (https://www.polymer-project.org/docs/polymer/binding-types.html#conditional-attributes)
*/

(function(Prism) {

	var polymer_binding_pattern = /\{\{[\w\W]*?\}\}|\[\[[\w\W]*?\]\]/g;
	
	Prism.languages.polymer = Prism.languages.extend('markup', {
		'polymer': {
			pattern: polymer_binding_pattern,
			inside: {
				'delimiter': {
					pattern: /^\{\{|\}\}$|^\[\[|\]\]$/ig,
					alias: 'punctuation'
				},
				'string': /(["'])(\\?.)+?\1/g,
				'number': /\b-?\d*\.?\d+\b/g,
				'keyword': /\b(in|as)\b/,
				'function': [
					/(?!\d)\w+(?=\()/g,
					{
						pattern: /([^|]\|\s*)(?!\d)\w+/g,
						lookbehind: true
					}
				],
				'operator': /[<>]=?|[!=]==?|[+\-*\/%!?]|&&|\|\|/g,
				'punctuation': /[\[\](){}.,:|]/g,
				'variable': /(?!\d)\w+/g
			}
		}
	});

	// Tokenize all inline Polymer binding expressions that are wrapped in {{ }}
	Prism.hooks.add('before-highlight', function(env) {
		if (env.language !== 'polymer') {
			return;
		}

		env.tokenStack = [];

		env.backupCode = env.code;
		env.code = env.code.replace(polymer_binding_pattern, function(match) {
			env.tokenStack.push(match);

			return '___POLYMER' + env.tokenStack.length + '___';
		});
	});

	// Restore env.code for other plugins (e.g. line-numbers)
	Prism.hooks.add('before-insert', function(env) {
		if (env.language === 'polymer') {
			env.code = env.backupCode;
			delete env.backupCode;
		}
	});

	// Re-insert the tokens after highlighting
	// and highlight them with defined grammar
	Prism.hooks.add('after-highlight', function(env) {
		if (env.language !== 'polymer') {
			return;
		}

		for (var i = 0, t; t = env.tokenStack[i]; i++) {
			env.highlightedCode = env.highlightedCode.replace('___POLYMER' + (i + 1) + '___', Prism.highlight(t, env.grammar, 'polymer'));
		}

		env.element.innerHTML = env.highlightedCode;
	});

}(Prism));