(function (Prism) {
	// using https://github.com/PrismJS/prism/blob/master/components/prism-perl.js as starting point
	// and not touching much initially 
	Prism.languages.raku = Prism.languages.extend('perl', {
		'function': {
			pattern: /(\b(?:sub|multi|proto)[ \t]+)\w+[- _ .]*\w*/,
			lookbehind: true
		},
		'keyword': /\b(?:any|break|continue|default|delete|die|do|else|elsif|eval|for|foreach|given|goto|hyper|if|last|local|map|my|multi|next|our|package|print|proto|redo|require|race|return|say|state|sub|switch|undef|unless|until|use|when|while)\b/,
		'operator': /-[rwxoRWXOezsfdlpSbctugkTBMAC]\b|\+[+=]?|-[-=>]?|\*\*?=?|\/\/?=?|=[=~>]?|~[~=]?|\|\|?=?|&&?=?|<(?:=>?|<=?)?|>>?=?|![~=]?|[%^]=?|\.(?:=|\.\.?)?|[\\?]|\bx(?:=|\b)|\b(?:and|cmp|eq|ge|gt|le|lt|ne|not|or|where|xor)\b/,
	});

}(Prism));
