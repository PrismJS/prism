(function (Prism) {

	var functionVariableLookahead = /\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\d)[$\w\xA0-\uFFFF]+)\s*=>)/.source;

	Prism.languages.javascript = Prism.languages.extend('clike', {
		'class-name': [
			{
				pattern: /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[.$\w\xA0-\uFFFF]+/i,
				lookbehind: true,
				inside: {
					'punctuation': /\./
				}
			},
			{
				pattern: /(^|[^$\w\xA0-\uFFFF])(?![\da-z])[$\w\xA0-\uFFFF]+(?=\.(?:prototype|constructor))/,
				lookbehind: true
			}
		],
		'keyword': [
			{
				pattern: /((?:^|})\s*)(?:catch|finally)\b/,
				lookbehind: true
			},
			{
				pattern: /(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
				lookbehind: true
			},
		],
		'number': /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
		// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
		'function': /#?(?!\d)[$\w\xA0-\uFFFF]+(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
		'operator': /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
	});

	Prism.languages.insertBefore('javascript', 'keyword', {
		'regex': {
			pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=\s*($|[\r\n,.;})\]]))/,
			lookbehind: true,
			greedy: true
		},
		// This must be declared before keyword because we use "function" inside the look-forward
		'function-variable': {
			pattern: RegExp(/#?(?!\d)[$\w\xA0-\uFFFF]+(?=\s*=<func>)/.source.replace(/<func>/g, functionVariableLookahead)),
			alias: 'function'
		},
		'parameter': [
			{
				pattern: /(function(?:\s+(?!\d)[$\w\xA0-\uFFFF]+)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
				lookbehind: true,
				inside: Prism.languages.javascript
			},
			{
				pattern: /(?!\d)[$\w\xA0-\uFFFF]+(?=\s*=>)/i,
				inside: Prism.languages.javascript
			},
			{
				pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
				lookbehind: true,
				inside: Prism.languages.javascript
			},
			{
				pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\d)[$\w\xA0-\uFFFF]+\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
				lookbehind: true,
				inside: Prism.languages.javascript
			}
		],
		'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
	});

	var propertyLiteral = /(?!\d|default\b)[$\w\xA0-\uFFFF]+/.source;

	Prism.languages.insertBefore('javascript', 'string', {
		'property': [
			{
				pattern: RegExp(/((?:^|[{,])\s*)/.source + propertyLiteral + '(?=\\s*:' + functionVariableLookahead + ')', 'm'),
				lookbehind: true,
				greedy: true,
				alias: ['function-variable', 'function']
			},
			{
				pattern: RegExp(/((?:^|[{,])\s*)(?:<prop>)(?=\s*:)/.source.replace(/<prop>/g, [
					// simple literals e.g. { foo: 5, bar: true }
					propertyLiteral,
					// string literals e.g. { "foo": 5, 'bar': true }
					/(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2/.source
				].join('|')), 'm'),
				lookbehind: true,
				greedy: true
			},
			{
				pattern: /((?:^|[{,])\s*)\[[^[\]]*\](?=\s*:)/m,
				lookbehind: true,
				greedy: true,
				alias: 'computed-property',
				inside: Prism.languages.javascript
			}
		],
		'template-string': {
			pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
			greedy: true,
			inside: {
				'template-punctuation': {
					pattern: /^`|`$/,
					alias: 'string'
				},
				'interpolation': {
					pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
					lookbehind: true,
					inside: {
						'interpolation-punctuation': {
							pattern: /^\${|}$/,
							alias: 'punctuation'
						},
						rest: Prism.languages.javascript
					}
				},
				'string': /[\s\S]+/
			}
		}
	});

	if (Prism.languages.markup) {
		Prism.languages.markup.tag.addInlined('script', 'javascript');
	}

	Prism.languages.js = Prism.languages.javascript;

}(Prism));
