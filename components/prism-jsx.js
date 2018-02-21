(function(Prism) {

var javascript = Prism.util.clone(Prism.languages.javascript);

var buildTagPattern = function (backrefNum, onlyOpeningTag) {
	return '<' +
		// Optional / for closing tags
		(onlyOpeningTag ? '' : '\\/?') +
		// Tag name
		'[\\w.:-]+\\s*' +
		'(?:\\s+(?:' +
			// Attribute name
			'[\\w.:-]+(?:=(?:' +
				// Quoted attribute value
				'("|\')(?:\\\\[\\s\\S]|(?!\\' + backrefNum + ')[^\\\\])*\\' + backrefNum +
				'|' +
				// Unquoted attribute value
				'[^\\s\'">=]+' +
				'|' +
				// Interpolation
				'(?:\\{\\{?[^}]*\\}?\\})' +
			'))?' +
			'|' +
			// Spread attributes
			'\\{\\.{3}[a-z_$][\\w$]*(?:\\.[a-z_$][\\w$]*)*\\}' +
		'))*' +
		// Optional slash for self-closing tags
		(onlyOpeningTag ? '' : '\\s*\\/?') +
		'>';
};

Prism.languages.jsx = Prism.languages.extend('markup', javascript);
Prism.languages.jsx.tag.pattern= new RegExp(buildTagPattern(1), 'i');

Prism.languages.jsx.tag.inside['attr-value'].pattern = /=(?!\{)(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">]+)/i;

Prism.languages.insertBefore('inside', 'attr-name', {
	'spread': {
		pattern: /\{\.{3}[a-z_$][\w$]*(?:\.[a-z_$][\w$]*)*\}/,
		inside: {
			'punctuation': /\.{3}|[{}.]/,
			'attr-value': /\w+/
		}
	}
}, Prism.languages.jsx.tag);

var jsxExpression = Prism.util.clone(Prism.languages.jsx);

delete jsxExpression.punctuation;

Prism.languages.insertBefore('jsx', 'tag', {
	'plain-text': {
		pattern: new RegExp('(' + buildTagPattern(2, true) + ')[\\s\\S]*?(?=' + buildTagPattern(3) + ')', 'i'),
		lookbehind: true,
		inside: {
			'script': {
				// Allow for one level of nesting
				pattern: /\{(?:\{[^}]*\}|[^}])+\}/i,
				inside: jsxExpression,
				'alias': 'language-javascript'
			}
		}
	}
});

jsxExpression = Prism.languages.insertBefore('jsx', 'operator', {
	'punctuation': /=(?={)|[{}[\];(),.:]/
}, { jsx: jsxExpression });

Prism.languages.insertBefore('inside', 'attr-value',{
	'script': {
		// Allow for one level of nesting
		pattern: /=\{(?:\{[^}]*\}|[^}])+\}/i,
		inside: jsxExpression,
		'alias': 'language-javascript'
	}
}, Prism.languages.jsx.tag);

}(Prism));
