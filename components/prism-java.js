Prism.languages.java = Prism.languages.extend('clike', {
	'keyword': /\b(abstract|continue|for|new|switch|assert|default|goto|package|synchronized|boolean|do|if|private|this|break|double|implements|protected|throw|byte|else|import|public|throws|case|enum|instanceof|return|transient|catch|extends|int|short|try|char|final|interface|static|void|class|finally|long|strictfp|volatile|const|float|native|super|while)\b/,
	// number is either
	// a word consisting of 0b the 0 or 1 number one or more times or
	// a word consisting of 0x an optional letter from a to f or digit perhaps one dot at least one letter from a to f or digit or
	// a word consisting of an optional digit perhaps one dot at least one digit perhaps the letter e a + or - symbol, optional digits and perhaps one of the letters d f l or
	// a word consisting of an optional digit perhaps one dot at least one digit
	'number': /\b0b[01]+\b|\b0x[\da-f]*\.?[\da-fp\-]+\b|\b\d+\.?\d*e?[+-]?[\d]*[dfl]*\b|\b\d*\.?\d+\b/i,
	'operator': {
		pattern: /(^|[^\.])(?:\+=|\+\+?|-=|--?|!=?|<{1,2}=?|>{1,3}=?|==?|&=|&&?|\|=|\|\|?|\?|\*=?|\/=?|%=?|\^=?|:|~)/m,
		lookbehind: true
	}
});
