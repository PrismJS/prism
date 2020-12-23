(function (Prism) {

	Prism.languages.javascript = Prism.languages.extend('clike', {
		'class-name': [
			Prism.languages.clike['class-name'],
			{
				pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
				lookbehind: true
			}
		],
		'keyword': [
			{
				pattern: /((?:^|})\s*)(?:catch|finally)\b/,
				lookbehind: true
			},
			{
				pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|(?:get|set)(?=\s*[\[$\w\xA0-\uFFFF])|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
				lookbehind: true
			},
		],
		// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
		'function': /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
		'number': /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
		'operator': /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
	});

	Prism.languages.javascript['class-name'][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;

	Prism.languages.insertBefore('javascript', 'keyword', {
		'regex': {
			pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
			lookbehind: true,
			greedy: true,
			inside: {
				'regex-source': {
					pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
					lookbehind: true,
					alias: 'language-regex',
					inside: Prism.languages.regex
				},
				'regex-flags': /[a-z]+$/,
				'regex-delimiter': /^\/|\/$/
			}
		},
		// This must be declared before keyword because we use "function" inside the look-forward
		'function-variable': {
			pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
			alias: 'function'
		},
		'parameter': [
			{
				pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
				lookbehind: true,
				inside: Prism.languages.javascript
			},
			{
				pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
				inside: Prism.languages.javascript
			},
			{
				pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
				lookbehind: true,
				inside: Prism.languages.javascript
			},
			{
				pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
				lookbehind: true,
				inside: Prism.languages.javascript
			}
		],
		'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
	});


	function nested(str, countLog2) {
		for (var i = 0; i < countLog2; i++) { // nested depth of 2 ** countLog2
			str = str.replace(/<self>/g, str);
		}
		return str.replace(/<self>/g, '[^\\s\\S]');
	}
	var string = /"(?:\\(?:\r\n|[\s\S])|[^\\\r\n"])*"|'(?:\\(?:\r\n|[\s\S])|[^\\\r\n'])*'/.source;
	var comment = /\/\*(?:[^*]|\*(?!\/))*\*\/|\/\/.*(?!.)/.source;
	var jsStringCommentAndDivision = '\\/(?![/*])' + '|' + comment + '|' + string;

	// template string need curly and curly need template strings
	// This is resolved by creating a temporary curly pattern without template strings.
	// This is only an approximation and will fail for template strings like `${`'`}`
	var tempCurly = nested('(?:[^/\'"{}]|' + jsStringCommentAndDivision + '|\\{<self>*\\})', 3);
	var tempTemplate = /`(?:\\[\s\S]|\${<curly>+}|(?!\${)[^\\`])*`/.source.replace(/<curly>/g, tempCurly);
	jsStringCommentAndDivision += '|' + tempTemplate;

	function createNested(open, close) {
		var expr = '(?:[^/\'"`' + open + close + ']|' + jsStringCommentAndDivision + '|' + open + '<self>*' + close + ')';
		return nested(expr, 3);
	}
	var curly = createNested('\\{', '\\}');
	var round = createNested('\\(', '\\)');
	var square = createNested('\\[', '\\]');

	// == /(?:[^/'"`()[\]{}]|<<string,comment,division>>|\(<<round>>*\)|\[<<square>>*\]|\{<<curly>>*\})/
	var jsExpr = '(?:[^/\'"`()[\\]{}]|' + jsStringCommentAndDivision + '|\\(' + round + '*\\)|\\[' + square + '*\\]|\\{' + curly + '*\\})';

	Object.defineProperty(Prism.languages.javascript, '$', {
		value: {
			string: string,
			comment: comment,
			curly: curly,
			round: round,
			square: square,
			expression: jsExpr
		}
	});

	Prism.languages.insertBefore('javascript', 'string', {
		'template-string': {
			pattern: RegExp(/`(?:\\[\s\S]|\${<curly>+}|(?!\${)[^\\`])*`/.source.replace(/<curly>/g, curly)),
			greedy: true,
			inside: {
				'template-punctuation': {
					pattern: /^`|`$/,
					alias: 'string'
				},
				'interpolation': {
					pattern: RegExp(/((?:^|[^\\])(?:\\{2})*)\${<curly>+}/.source.replace(/<curly>/g, curly)),
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
