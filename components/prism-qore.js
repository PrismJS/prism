Prism.languages.qore = Prism.languages.extend('clike', {
  'comment': {
    pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|((\/\/)|#).*?(\r?\n|$))/g, // /(^|[^\\])([\w\W]*?\*\/|(^|[^:])\/\/.*?(\r?\n|$))/g,
    lookbehind: true
  },
	'variable': /(\$\w+)\b/ig,
	'keyword': /\b(abstract|any|assert|binary|bool|boolean|break|byte|case|catch|char|class|code|const|continue|data|default|do|double|else|enum|extends|final|finally|float|for|goto|hash|if|implements|import|inherits|instanceof|int|interface|long|my|native|new|nothing|null|object|our|own|private|reference|rethrow|return|short|softint|softfloat|softnumber|softbool|softstring|softdate|softlist|static|strictfp|string|sub|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while)\b/g,
	'number': /\b0b[01]+\b|\b0x[\da-f]*\.?[\da-fp\-]+\b|\b\d*\.?\d+[e]?[\d]*[df]\b|\W\d*\.?\d+\b/gi,
  'boolean': /\b(true|false)\b/ig,
	'operator': {
		pattern: /([^\.]|^)([-+]{1,2}|!|=?&lt;|=?&gt;|={1,2}|(&amp;){1,2}|\|?\||\?|\*|\/|%|\^|(&lt;){2}|($gt;){2,3}|:|~|new|background|dlete|remove|cast|shift|pop|chomp|trim|elements|keys|exists|instanceof|unshift|push|splice|extract|map|foldl|foldr|select|\$)/g,
		lookbehind: true
	},
	'function': {
		pattern: /[a-z0-9_]+\(/ig,
		inside: {
			punctuation: /\(/
		}
	},
});