Prism.languages.idris = {
	'comment': {
		pattern: /(?:(?:--|\|\|\|).*$|{-[\s\S]*?-})/m,
	},
	'char': {
		pattern: /'(?:[^\\']|\\(?:[abfnrtv\\"'&]|\^[A-Z@[\]^_]|NUL|SOH|STX|ETX|EOT|ENQ|ACK|BEL|BS|HT|LF|VT|FF|CR|SO|SI|DLE|DC1|DC2|DC3|DC4|NAK|SYN|ETB|CAN|EM|SUB|ESC|FS|GS|RS|US|SP|DEL|\d+|o[0-7]+|x[0-9a-fA-F]+))'/,
		alias: 'string'
	},
	'string': {
		pattern: /"(?:[^\\"]|\\(?:\S|\s+\\))*"/,
		greedy: true
	},
        'keyword': /\b(?:Type|case|class|codata|constructor|corecord|data|do|dsl|else|export|if|implementation|implicit|import|impossible|in|infix|infixl|infixr|instance|interface|let|module|mutual|namespace|of|parameters|partial|postulate|private|proof|public|quoteGoal|record|rewrite|syntax|then|total|using|where|with)\b/,
	'import-statement': {
		pattern: /(^\s*)import\s+(?:[A-Z][\w']*)(?:\.[A-Z][\w']*)*/m,
		lookbehind: true,
	},
	// decimal integers and floating point numbers | octal integers | hexadecimal integers
	'number': /\b(?:\d+(?:\.\d+)?(?:e[+-]?\d+)?|0o[0-7]+|0x[0-9a-f]+)\b/i,
	// Most of this is needed because of the meaning of a single '.'.
	// If it stands alone freely, it is the function composition.
	// It may also be a separator between a module name and an identifier => no
	// operator. If it comes together with other special characters it is an
	// operator too.
	'operator': /\s\.\s|[-!#$%*+=?&@|~:<>^\\\/]*\.[-!#$%*+=?&@|~.:<>^\\\/]+|[-!#$%*+=?&@|~.:<>^\\\/]+\.[-!#$%*+=?&@|~:<>^\\\/]*|[-!#$%*+=?&@|~:<>^\\\/]+|`(?:[A-Z][\w']*\.)*[_a-z][\w']*`/,
	// In Idris, nearly everything is a variable, do not highlight these.
	'hvariable': /\b(?:[A-Z][\w']*\.)*[_a-z][\w']*\b/,
	'constant': /\b(?:[A-Z][\w']*\.)*[A-Z][\w']*\b/,
	'punctuation': /[{}[\];(),.:]/
};

Prism.languages.idr = Prism.languages.idris;
